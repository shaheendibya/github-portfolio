"""Exercise the portfolio and archive through a real browser; no build required."""
import argparse
from urllib.request import Request, urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'

for path in ['index.html', 'style.css', 'app.js', 'archive.html', 'archive.css',
             'archive.js', 'achievements.js', 'assets/favicon.svg', 'assets/portrait.png']:
    with urlopen(base + path, timeout=10) as response:
        assert response.status == 200 and response.read(), path
for path in ['cv.pdf', 'lifelong-achievements.pdf', 'insignia-competition.pdf']:
    with urlopen(Request(base + 'assets/documents/' + path, method='HEAD'), timeout=10) as response:
        assert response.status == 200 and response.headers.get_content_type() == 'application/pdf', path
print('PASS: pages, assets, and three original PDF downloads')

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    errors, failed_requests, http_errors = [], [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failed_requests.append(request.url))
    page.on('response', lambda response: http_errors.append((response.status, response.url)) if response.status >= 400 else None)
    page.goto(base, wait_until='networkidle')
    expect(page).to_have_title('Shaheen Rahman Dibya — Engineering Portfolio')
    expect(page.locator('.project-card:visible')).to_have_count(5)
    assert page.locator('.portrait-frame img').evaluate('(image) => image.complete && image.naturalWidth > 0')
    for category, count in [('simulation', 2), ('hardware', 2), ('design', 1), ('all', 5)]:
        button = page.locator(f'[data-project-filter="{category}"]')
        button.click()
        expect(page.locator('.project-card:visible')).to_have_count(count)
        expect(button).to_have_attribute('aria-pressed', 'true')
        expect(page.locator('#project-count')).to_have_text(f'Showing {count} project' + ('' if count == 1 else 's'))
    for button in page.locator('.project-open').all():
        title = button.inner_text()
        button.click()
        expect(page.locator('#dialog-title')).to_have_text(title)
        expect(page.locator('#dialog-tags span')).to_have_count(3)
        assert page.locator('#dialog-contribution').inner_text().strip()
        page.keyboard.press('Escape')
        expect(page.locator('#project-dialog')).not_to_be_visible()
    page.locator('#copy-email').click()
    expect(page.locator('#copy-status')).to_contain_text('Email copied')
    assert page.evaluate('navigator.clipboard.readText()') == 'shaheen.dibya17@gmail.com'
    page.evaluate("() => { navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); }; }")
    page.locator('#copy-email').click()
    expect(page.locator('#copy-status')).to_contain_text('Please select and copy')
    print('PASS: project filters, all five project dialogs, clipboard copy and fallback')

    page.goto(base + 'archive.html', wait_until='networkidle')
    records = page.evaluate('window.portfolioAchievements')
    assert len(records) == 32 and len({record['id'] for record in records}) == 32
    sources = {(source['url'], source['page']) for record in records for source in record['sources']}
    expected_sources = {('assets/documents/lifelong-achievements.pdf', number) for number in range(1, 30)}
    expected_sources |= {('assets/documents/insignia-competition.pdf', 1), ('assets/documents/cv.pdf', 1)}
    assert sources == expected_sources, 'Every page of the supplied documents must remain accessible'
    expect(page.locator('.archive-card')).to_have_count(32)
    for category in {record['category'] for record in records}:
        page.locator(f'.archive-category[data-category="{category}"]').click()
        expect(page.locator('.archive-card')).to_have_count(sum(record['category'] == category for record in records))
    page.locator('.archive-category[data-category="all"]').click()
    page.locator('#archive-year').select_option('undated')
    expect(page.locator('.archive-card')).to_have_count(1)
    expect(page.locator('.archive-card-title')).to_contain_text('BrandEdge')
    page.locator('#archive-clear').click()
    page.locator('#archive-search').fill('university physics')
    expect(page.locator('.archive-card')).to_have_count(1)
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-title')).to_contain_text('University Physics')
    expect(page.locator('#certificate-source-nav button')).to_have_count(3)
    page.locator('#certificate-source-nav button').nth(1).click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/lifelong-achievements.pdf#page=29')
    page.wait_for_function('document.querySelector("#certificate-preview img")?.naturalWidth > 0')
    page.locator('#certificate-source-nav button').nth(2).click()
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/cv.pdf#page=1')
    page.keyboard.press('Escape')
    expect(page.locator('#certificate-dialog')).not_to_be_visible()
    expect(page.locator('.archive-card-title')).to_be_focused()
    page.locator('#archive-clear').click()
    page.locator('#archive-kind').select_option('participation')
    expect(page.locator('.archive-card')).to_have_count(sum(record['kind'] == 'participation' for record in records))
    page.locator('#archive-search').fill('this-record-does-not-exist')
    expect(page.locator('#archive-empty')).to_be_visible()
    page.locator('#archive-empty-clear').click()
    expect(page.locator('.archive-card')).to_have_count(32)
    page.locator('#archive-search').fill('soccerbot')
    page.locator('.archive-card-title').click()
    expect(page.locator('#certificate-result')).to_have_text('Champion')
    expect(page.locator('#certificate-original')).to_have_attribute('href', 'assets/documents/cv.pdf#page=1')
    page.locator('.certificate-close').click()
    print('PASS: all 32 records, all document pages, categories, year/type/search filters, certificate sources, empty state, and CV-only record')

    for path in ['index.html', 'archive.html']:
        for width in [1440, 1024, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.goto(base + path, wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Horizontal overflow: {path} at {width}px'
        button = page.locator('.mobile-toggle')
        expect(button).to_be_visible()
        expect(page.locator('.desktop-nav')).not_to_be_visible()
        button.click()
        expect(button).to_have_attribute('aria-expanded', 'true')
        expect(page.locator('.desktop-nav')).to_be_visible()
        page.keyboard.press('Escape')
        expect(button).to_have_attribute('aria-expanded', 'false')
        expect(button).to_be_focused()
    page.goto(base + 'archive.html?search=University%20Physics', wait_until='networkidle')
    expect(page.locator('.archive-card')).to_have_count(1)
    expect(page.locator('.archive-card-title')).to_contain_text('University Physics')
    assert not errors, errors
    assert not failed_requests, failed_requests
    assert not http_errors, http_errors
    print('PASS: five desktop/mobile widths on both pages, mobile navigation, achievement deep link, no JavaScript or resource errors')
    browser.close()
