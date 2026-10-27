"""Verify the IARCO feature, participation source, and pending placement certificate."""
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
    assert response.status == 200
    assert response.headers.get_content_type() == 'application/pdf'
    assert body.startswith(b'%PDF-') and body == (repo / pdf).read_bytes()
print('PASS: original IARCO participation PDF is available without changes')

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.on('response', lambda response: failures.append(f'{response.status}: {response.url}') if response.status >= 400 else None)
    page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
    expect(page.locator('.archive-card')).to_have_count(1)
    record = page.evaluate('window.portfolioAchievements.find(record => record.id === "iarco-2026-senior")')
    assert record and record['title'] == 'IARCO 2026 — Senior Category'
    assert record['result'] == '6th place' and record['year'] == 2026
    assert record['category'] == 'academics' and record['kind'] == 'award'
    assert len(record['sources']) == 2
    actual, pending = record['sources']
    assert actual['url'] == pdf and actual['page'] == 1 and actual['image'] == image
    assert pending['status'] == 'pending' and pending['placeholder'] == '6th'
    assert all(not pending.get(key) for key in ['url', 'page', 'image', 'thumbnail'])
    evidence = record['description'] + ' ' + record.get('note', '')
    assert re.search(r'participation', evidence, re.I) and re.search(r'pending|forthcoming', evidence, re.I)
    assert re.search(r'57\s*(?:/|out of)\s*70', evidence)
    expect(page.locator('.archive-documents a')).to_have_count(5)
    expect(page.locator('.archive-documents').locator(f'a[href="{pdf}"]')).to_have_count(1)

    def open_iarco():
        page.locator('#archive-search').fill('IARCO')
        expect(page.locator('.archive-card')).to_have_count(1)
        page.locator('.archive-card-title').click()
        expect(page.locator('#certificate-title')).to_have_text(record['title'])
        expect(page.locator('#certificate-result')).to_have_text('6th place')
        expect(page.locator('#certificate-source-nav button')).to_have_count(2)

    def expect_actual():
        preview = page.locator('#certificate-preview img')
        expect(preview).to_have_count(1)
        expect(preview).to_have_attribute('src', image)
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth >= 1500 && image.naturalWidth > image.naturalHeight')
        expect(page.locator('#certificate-original')).to_be_visible()
        expect(page.locator('#certificate-original')).to_have_attribute('href', pdf + '#page=1')
        expect(page.locator('.certificate-read-note')).to_contain_text(re.compile(r'original PDF', re.I))

    def show_pending():
        button = page.locator('#certificate-source-nav button').nth(1)
        button.focus()
        page.keyboard.press('Enter')
        expect(button).to_have_attribute('aria-pressed', 'true')
        expect(button).to_be_focused()
        expect(page.locator('#certificate-preview img')).to_have_count(0)
        expect(page.locator('#certificate-preview')).to_contain_text('6th')
        expect(page.locator('#certificate-preview')).to_contain_text(re.compile(r'pending|forthcoming', re.I))
        expect(page.locator('#certificate-original')).not_to_be_visible()
        assert page.locator('#certificate-original').get_attribute('href') is None
        expect(page.locator('.certificate-read-note')).to_have_text(pending['pendingMessage'])

    open_iarco()
    expect_actual()
    show_pending()
    page.locator('#certificate-source-nav button').first.focus()
    page.keyboard.press('Space')
    expect_actual()
    show_pending()
    page.keyboard.press('Escape')
    page.locator('#archive-search').fill('University Physics')
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-title')).to_contain_text('University Physics')
    expect(page.locator('#certificate-preview img')).to_have_count(1)
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=1')
    page.keyboard.press('Escape')
    open_iarco()
    expect_actual()
    page.keyboard.press('Escape')
    print('PASS: documented participation, honest pending state, keyboard source switching, and dialog reset')

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
            widths = features.evaluate_all('(cards) => cards.map(card => card.getBoundingClientRect().width)')
            assert abs(widths[0] - widths[1]) < 2, (theme, width, widths)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'home')
            page.goto(base + 'archive.html?search=IARCO', wait_until='networkidle')
            expect(page.locator('.archive-card')).to_have_count(1)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'archive')
            open_iarco()
            expect_actual()
            show_pending()
            assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, 'dialog')
            page.keyboard.press('Escape')
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: peer homepage features and IARCO archive/modal in both themes at four viewport widths; no browser/resource errors')
