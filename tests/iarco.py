"""Verify the official IARCO sixth-place award separately from Research 101 participation."""
import argparse
from hashlib import sha256
from pathlib import Path
import re
from urllib.parse import parse_qs, urlsplit
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
repo = Path(__file__).resolve().parents[1]
participation_pdf = 'assets/documents/iarco-2026-participation.pdf'
participation_image = 'assets/certificates/iarco-2026-participation.webp'
placement_pdf = 'assets/documents/iarco-2026-sixth-place.pdf'
placement_image = 'assets/certificates/iarco-2026-sixth-place.webp'
# SHA256 of the supplied IARCO_2026_Finalist_Shaheen_Rahman_Dibya_5483.pdf.
original_placement_digest = 'adfcaf9ac451728cc5c1da64906d77e05bc573fff65e9593a200b901863dc614'

for path in [participation_pdf, placement_pdf]:
    with urlopen(base + path, timeout=15) as response:
        body = response.read()
        assert response.status == 200 and response.headers.get_content_type() == 'application/pdf'
        assert body.startswith(b'%PDF-') and body == (repo / path).read_bytes()
        if path == placement_pdf:
            assert sha256(body).hexdigest() == original_placement_digest, 'The official PDF must remain an exact copy of the upload'
print('PASS: both original IARCO PDFs are available; the official placement PDF matches the uploaded checksum')


def evidence(record):
    return ' '.join(str(record.get(key, '')) for key in ['title', 'result', 'description', 'note'])


def wait_record_url(page, record_id=None):
    page.wait_for_function('''recordId => {
        const query = new URLSearchParams(location.search);
        return recordId === null ? !query.has('record') : query.get('record') === recordId;
    }''', arg=record_id)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.on('response', lambda response: failures.append(f'{response.status}: {response.url}') if response.status >= 400 else None)
    page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
    expect(page.locator('html')).to_have_attribute('data-theme', 'light')
    expect(page.locator('.archive-card')).to_have_count(2)
    records = page.evaluate('window.portfolioAchievements.filter(record => record.id.startsWith("iarco-"))')
    assert {record['id'] for record in records} == {'iarco-2026-participation', 'iarco-2026-senior'}
    participation = next(record for record in records if record['id'] == 'iarco-2026-participation')
    placement = next(record for record in records if record['id'] == 'iarco-2026-senior')
    assert participation['title'] == 'IARCO 2026 — Senior Participation'
    assert participation['result'] == 'Participation' and participation['kind'] == 'participation'
    assert placement['kind'] == 'award' and re.search(r'6th|sixth', placement['result'], re.I)
    for record in records:
        assert record['category'] == 'academics' and record['year'] == 2026
        assert len(record['sources']) == 1 and record.get('certificateStatus') != 'pending'
    for record, pdf, image in [(participation, participation_pdf, participation_image), (placement, placement_pdf, placement_image)]:
        source = record['sources'][0]
        assert source['url'] == pdf and source['page'] == 1 and source['image'] == image
        assert source.get('status') != 'pending'
    assert re.search(r'57\s*(?:/|out of)\s*70', evidence(participation))
    assert re.search(r'four|4', evidence(participation))
    assert not re.search(r'6th|sixth|138\s*(?:/|out of)\s*200|pending', evidence(participation), re.I)
    assert re.search(r'Senior', evidence(placement), re.I)
    assert re.search(r'138\s*(?:/|out of)\s*200', evidence(placement))
    assert not re.search(r'57\s*(?:/|out of)\s*70|bootcamp|pending', evidence(placement), re.I)
    expect(page.locator('.archive-documents a')).to_have_count(6)
    for pdf in [participation_pdf, placement_pdf]:
        expect(page.locator('.archive-documents').locator(f'a[href="{pdf}"]')).to_have_count(1)
    page.locator('#archive-kind').select_option('award')
    expect(page.locator('.archive-card')).to_have_count(1)
    expect(page.locator('.archive-card-title')).to_have_text(placement['title'])
    page.locator('#archive-kind').select_option('participation')
    expect(page.locator('.archive-card')).to_have_count(1)
    expect(page.locator('.archive-card-title')).to_have_text(participation['title'])
    page.locator('#archive-kind').select_option('all')

    def expect_record(record):
        official = record['id'] == 'iarco-2026-senior'
        pdf = placement_pdf if official else participation_pdf
        image = placement_image if official else participation_image
        expect(page.locator('#certificate-dialog')).to_be_visible()
        expect(page.locator('#certificate-title')).to_have_text(record['title'])
        expect(page.locator('#certificate-result')).to_have_text(record['result'])
        preview = page.locator('#certificate-preview img')
        expect(preview).to_have_count(1)
        expect(preview).to_have_attribute('src', image)
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth >= 1500')
        assert preview.evaluate('(image) => image.naturalHeight > image.naturalWidth') == official
        expect(page.locator('#certificate-original')).to_be_visible()
        expect(page.locator('#certificate-original')).to_have_attribute('href', pdf + '#page=1')
        expect(page.locator('.certificate-read-note')).to_contain_text(re.compile(r'original PDF', re.I))
        expect(page.locator('#certificate-source-nav button')).to_have_count(1)
        expect(page.locator('#certificate-event-details')).to_be_hidden()
        wait_record_url(page, record['id'])
        assert parse_qs(urlsplit(page.url).query).get('record') == [record['id']]
        text = page.locator('#certificate-dialog').inner_text()
        assert not re.search(r'pending|forthcoming|awaiting', text, re.I)
        if official:
            assert re.search(r'138\s*(?:/|out of)\s*200', text)
            assert not re.search(r'57\s*(?:/|out of)\s*70|bootcamp', text, re.I)
        else:
            assert re.search(r'57\s*(?:/|out of)\s*70', text)
            assert not re.search(r'6th|sixth|138\s*(?:/|out of)\s*200', text, re.I)

    for record in [placement, participation]:
        page.get_by_role('button', name=record['title'], exact=True).click()
        expect_record(record)
        page.keyboard.press('Escape')
        expect(page.locator('#certificate-dialog')).to_be_hidden()
        wait_record_url(page)
        assert 'record' not in parse_qs(urlsplit(page.url).query)
    page.locator('#archive-search').fill('University Physics')
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=1')
    page.locator('#certificate-source-nav button').nth(1).click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=29')
    page.keyboard.press('Escape')
    wait_record_url(page)
    page.locator('#archive-search').fill('IARCO')
    page.get_by_role('button', name=participation['title'], exact=True).click()
    expect_record(participation)
    page.keyboard.press('Escape')
    wait_record_url(page)

    page.goto(base + 'archive.html?search=IARCO&kind=award&year=2026&record=iarco-2026-senior#archive-grid', wait_until='networkidle')
    expect_record(placement)
    page.locator('.certificate-close').click()
    expect(page.locator('#certificate-dialog')).to_be_hidden()
    wait_record_url(page)
    assert parse_qs(urlsplit(page.url).query) == {'search': ['IARCO'], 'kind': ['award'], 'year': ['2026']}
    assert urlsplit(page.url).fragment == 'archive-grid'
    expect(page.locator('#archive-search')).to_have_value('IARCO')
    expect(page.locator('#archive-kind')).to_have_value('award')
    expect(page.locator('#archive-year')).to_have_value('2026')
    expect(page.locator('.archive-card')).to_have_count(1)
    print('PASS: distinct award/participation records, scores, filters, source reset, direct links, and closing without losing filters')

    for theme in ['light', 'dark']:
        page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base, wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('data-theme', theme)
            features = page.locator('.recognition-feature')
            expect(features).to_have_count(1)
            expect(features.filter(has_text='UNIVERSITY PHYSICS')).to_have_count(0)
            expect(page.locator('.recognition-stack, .recognition-small')).to_have_count(0)
            rank = features.filter(has_text='IARCO')
            expect(rank).to_have_count(1)
            expect(rank).to_contain_text(re.compile(r'6th|sixth', re.I))
            assert not re.search(r'pending|forthcoming|awaiting|57\s*/\s*70|bootcamp', rank.inner_text(), re.I)
            official_link = rank.locator('a[href="archive.html?record=iarco-2026-senior"]').first
            expect(official_link).to_be_visible()
            expect(rank.locator(f'img[src="{participation_image}"], a[href="{participation_pdf}"]')).to_have_count(0)
            expect(page.locator('.placement-certificate-placeholder')).to_have_count(0)
            showcase = page.locator('#iarco-participation')
            showcase.scroll_into_view_if_needed()
            expect(showcase).to_be_visible()
            expect(showcase).to_contain_text(re.compile(r'participation', re.I))
            expect(showcase).to_contain_text(re.compile(r'57\s*/\s*70'))
            expect(showcase).to_contain_text(re.compile(r'four|4'))
            assert not re.search(r'6th|sixth|138\s*/\s*200', showcase.inner_text(), re.I)
            certificate = showcase.locator(f'img[src="{participation_image}"]')
            expect(certificate).to_have_count(1)
            certificate.evaluate('(image) => image.decode()')
            assert certificate.evaluate('(image) => image.naturalWidth >= 1500')
            expect(showcase.locator(f'a[href="{participation_pdf}"]').first).to_be_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'home')
            official_link.click()
            expect_record(placement)
            assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, 'official dialog')
            page.keyboard.press('Escape')
            wait_record_url(page)
            page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
            expect(page.locator('.archive-card')).to_have_count(2)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'archive')
            page.get_by_role('button', name=participation['title'], exact=True).click()
            expect_record(participation)
            assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, 'participation dialog')
            page.keyboard.press('Escape')
            wait_record_url(page)
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: linked official placement and separate participation showcases in both themes at four widths; no browser/resource errors')
