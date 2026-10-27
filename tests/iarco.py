"""Verify separate IARCO participation and sixth-place records, with no award attachment."""
import argparse
import json
from pathlib import Path
import re
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
pdf = 'assets/documents/iarco-2026-participation.pdf'
image = 'assets/certificates/iarco-2026-participation.webp'
repo = Path(__file__).resolve().parents[1]
with urlopen(base + pdf, timeout=15) as response:
    body = response.read()
    assert response.status == 200 and response.headers.get_content_type() == 'application/pdf'
    assert body.startswith(b'%PDF-') and body == (repo / pdf).read_bytes()
print('PASS: original participation PDF is available without changes')

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.on('response', lambda response: failures.append(f'{response.status}: {response.url}') if response.status >= 400 else None)
    page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
    expect(page.locator('.archive-card')).to_have_count(2)
    records = page.evaluate('window.portfolioAchievements.filter(record => record.id.startsWith("iarco-2026-"))')
    assert len(records) == 2
    award = next(record for record in records if record['id'] == 'iarco-2026-senior')
    participation = next(record for record in records if record['id'] == 'iarco-2026-participation')
    assert award['title'] == 'IARCO 2026 — Senior Category' and award['result'] == '6th place'
    assert award['kind'] == 'award' and award['year'] == 2026 and award['category'] == 'academics'
    assert award['certificateStatus'] == 'pending' and award['sources'] == []
    assert not re.search(r'participation|57\s*/\s*70|bootcamp', json.dumps(award), re.I)
    assert participation['title'] == 'IARCO 2026 — Senior Participation'
    assert participation['result'] == 'Participation' and participation['kind'] == 'participation'
    assert participation['category'] == 'academics' and participation['year'] == 2026
    assert len(participation['sources']) == 1
    source = participation['sources'][0]
    assert source['url'] == pdf and source['page'] == 1 and source['image'] == image
    assert source.get('status') != 'pending'
    evidence = participation['description'] + ' ' + participation.get('note', '')
    assert re.search(r'57\s*(?:/|out of)\s*70', evidence) and re.search(r'four|4', evidence)
    expect(page.locator('.archive-documents a')).to_have_count(5)
    expect(page.locator('.archive-documents').locator(f'a[href="{pdf}"]')).to_have_count(1)
    for kind, title in [('award', award['title']), ('participation', participation['title'])]:
        page.locator('#archive-kind').select_option(kind)
        expect(page.locator('.archive-card')).to_have_count(1)
        expect(page.locator('.archive-card-title')).to_have_text(title)
    page.locator('#archive-kind').select_option('all')
    expect(page.locator('.archive-card')).to_have_count(2)
    award_card = page.locator('.archive-card').filter(has=page.get_by_role('button', name=award['title'], exact=True))
    expect(award_card.locator('img')).to_have_count(0)
    expect(award_card.locator('a[href]')).to_have_count(0)

    def open_record(record):
        page.get_by_role('button', name=record['title'], exact=True).click()
        expect(page.locator('#certificate-title')).to_have_text(record['title'])
        expect(page.locator('#certificate-result')).to_have_text(record['result'])

    def expect_participation():
        preview = page.locator('#certificate-preview img')
        expect(preview).to_have_count(1)
        expect(preview).to_have_attribute('src', image)
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth >= 1500 && image.naturalWidth > image.naturalHeight')
        expect(page.locator('#certificate-original')).to_be_visible()
        expect(page.locator('#certificate-original')).to_have_attribute('href', pdf + '#page=1')
        expect(page.locator('.certificate-read-note')).to_contain_text(re.compile(r'original PDF', re.I))
        expect(page.locator('#certificate-source-nav button')).to_have_count(1)

    def expect_empty_award():
        expect(page.locator('#certificate-preview img')).to_have_count(0)
        expect(page.locator('#certificate-preview a[href]')).to_have_count(0)
        expect(page.locator('#certificate-original')).not_to_be_visible()
        assert page.locator('#certificate-original').get_attribute('href') is None
        expect(page.locator('#certificate-source-nav button')).to_have_count(0)
        expect(page.locator('.certificate-read-note')).to_contain_text(re.compile(r'pending|forthcoming|not yet|once.*available|will be added', re.I))
        assert 'participation' not in page.locator('#certificate-dialog').inner_text().lower()

    open_record(participation)
    expect_participation()
    page.keyboard.press('Escape')
    open_record(award)
    expect_empty_award()
    page.keyboard.press('Escape')
    page.locator('#archive-search').fill('University Physics')
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=1')
    page.keyboard.press('Escape')
    page.locator('#archive-search').fill('IARCO')
    open_record(participation)
    expect_participation()
    page.keyboard.press('Escape')
    print('PASS: separate filtered records and participation → empty award → documented record reset')

    for theme in ['light', 'dark']:
        page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base, wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('data-theme', theme)
            features = page.locator('.recognition-feature')
            expect(features).to_have_count(2)
            expect(features.filter(has_text='UNIVERSITY PHYSICS')).to_have_count(1)
            iarco = features.filter(has_text='IARCO')
            expect(iarco).to_have_count(1)
            expect(iarco).to_contain_text(re.compile(r'6th|sixth', re.I))
            assert not re.search(r'participation|57\s*/\s*70|bootcamp', iarco.inner_text(), re.I)
            assert pdf not in iarco.inner_html() and image not in iarco.inner_html()
            widths = features.evaluate_all('(cards) => cards.map(card => card.getBoundingClientRect().width)')
            assert abs(widths[0] - widths[1]) < 2, (theme, width, widths)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'home')
            page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
            expect(page.locator('.archive-card')).to_have_count(2)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'archive')
            for record, verify in [(participation, expect_participation), (award, expect_empty_award)]:
                open_record(record)
                verify()
                assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, record['id'])
                page.keyboard.press('Escape')
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: peer homepage features and separate archive/modals in both themes at four widths; no browser/resource errors')
