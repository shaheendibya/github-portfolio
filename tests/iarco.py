"""Verify the full IARCO participation showcase and its separate pending placement feature."""
import argparse
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
    expect(page.locator('html')).to_have_attribute('data-theme', 'light')
    expect(page.locator('.archive-card')).to_have_count(1)
    records = page.evaluate('window.portfolioAchievements.filter(record => record.id.startsWith("iarco-"))')
    assert len(records) == 1
    participation = records[0]
    assert participation['id'] == 'iarco-2026-participation'
    assert participation['title'] == 'IARCO 2026 — Senior Participation'
    assert participation['result'] == 'Participation' and participation['kind'] == 'participation'
    assert participation['category'] == 'academics' and participation['year'] == 2026
    assert len(participation['sources']) == 1
    source = participation['sources'][0]
    assert source['url'] == pdf and source['page'] == 1 and source['image'] == image
    assert source.get('status') != 'pending'
    evidence = participation['description'] + ' ' + participation.get('note', '')
    assert re.search(r'57\s*(?:/|out of)\s*70', evidence) and re.search(r'four|4', evidence)
    assert not re.search(r'6th|sixth|placement.*pending', evidence, re.I)
    expect(page.locator('.archive-documents a')).to_have_count(5)
    expect(page.locator('.archive-documents').locator(f'a[href="{pdf}"]')).to_have_count(1)
    page.locator('#archive-kind').select_option('award')
    expect(page.locator('.archive-card')).to_have_count(0)
    expect(page.locator('#archive-empty')).to_be_visible()
    page.locator('#archive-kind').select_option('participation')
    expect(page.locator('.archive-card')).to_have_count(1)
    expect(page.locator('.archive-card-title')).to_have_text(participation['title'])
    page.locator('#archive-kind').select_option('all')
    assert not re.search(r'6th|sixth', page.locator('#archive-grid').inner_text(), re.I)

    def open_participation():
        page.get_by_role('button', name=participation['title'], exact=True).click()
        expect(page.locator('#certificate-title')).to_have_text(participation['title'])
        expect(page.locator('#certificate-result')).to_have_text('Participation')
        preview = page.locator('#certificate-preview img')
        expect(preview).to_have_count(1)
        expect(preview).to_have_attribute('src', image)
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth >= 1500 && image.naturalWidth > image.naturalHeight')
        expect(page.locator('#certificate-original')).to_be_visible()
        expect(page.locator('#certificate-original')).to_have_attribute('href', pdf + '#page=1')
        expect(page.locator('.certificate-read-note')).to_contain_text(re.compile(r'original PDF', re.I))
        expect(page.locator('#certificate-source-nav button')).to_have_count(1)
        assert not re.search(r'6th|sixth', page.locator('#certificate-dialog').inner_text(), re.I)

    open_participation()
    page.keyboard.press('Escape')
    page.locator('#archive-search').fill('University Physics')
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=1')
    page.keyboard.press('Escape')
    page.locator('#archive-search').fill('IARCO')
    open_participation()
    page.keyboard.press('Escape')
    print('PASS: participation-only archive, award/participation filters, and documented-record dialog reset')

    for theme in ['light', 'dark']:
        page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base, wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('data-theme', theme)
            features = page.locator('.recognition-feature')
            expect(features).to_have_count(2)
            expect(features.filter(has_text='UNIVERSITY PHYSICS')).to_have_count(1)
            rank = features.filter(has_text='IARCO')
            expect(rank).to_have_count(1)
            expect(rank).to_contain_text(re.compile(r'6th|sixth', re.I))
            expect(rank).to_contain_text(re.compile(r'pending|forthcoming|awaiting', re.I))
            expect(rank.locator('img, a[href*=".pdf"], a[href*="archive.html"]')).to_have_count(0)
            assert not re.search(r'participation|57\s*/\s*70|bootcamp', rank.inner_text(), re.I)
            showcase = page.locator('#iarco-participation')
            expect(showcase).to_have_count(1)
            showcase.scroll_into_view_if_needed()
            expect(showcase).to_be_visible()
            expect(showcase).to_contain_text(re.compile(r'participation', re.I))
            expect(showcase).to_contain_text(re.compile(r'57\s*/\s*70'))
            expect(showcase).to_contain_text(re.compile(r'four|4'))
            assert not re.search(r'6th|sixth', showcase.inner_text(), re.I)
            certificate = showcase.locator(f'img[src="{image}"]')
            expect(certificate).to_have_count(1)
            certificate.evaluate('(image) => image.decode()')
            assert certificate.evaluate('(image) => image.naturalWidth >= 1500')
            expect(showcase.locator(f'a[href="{pdf}"]').first).to_be_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'home')
            page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
            expect(page.locator('.archive-card')).to_have_count(1)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'archive')
            open_participation()
            assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, 'dialog')
            page.keyboard.press('Escape')
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: full participation showcase and unattached placement feature in both themes at four widths; no browser/resource errors')
