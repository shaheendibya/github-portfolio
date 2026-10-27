"""Check optional themes, restrained motion, and portfolio layout refinements."""
import argparse
from urllib.parse import urljoin

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
paths = ['index.html', 'archive.html',
         'project.html?project=stock-market-crash-simulator']


def expect_theme(page, theme):
    expect(page.locator('html')).to_have_attribute('data-theme', theme)
    expect(page.locator('.theme-toggle')).to_have_attribute(
        'aria-pressed', str(theme == 'dark').lower())
    expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
        'content', '#111b18' if theme == 'dark' else '#f7f7f2')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    # The familiar light palette remains the default even with a dark OS theme.
    context = browser.new_context(color_scheme='dark')
    page = context.new_page()
    page.goto(base, wait_until='networkidle')
    expect_theme(page, 'light')
    page.locator('.theme-toggle').focus()
    page.keyboard.press('Space')
    expect_theme(page, 'dark')
    assert page.evaluate('localStorage.getItem("dibya-theme")') == 'dark'
    for path in paths:
        page.goto(base + path, wait_until='networkidle')
        expect_theme(page, 'dark')
        page.reload(wait_until='networkidle')
        expect_theme(page, 'dark')
    page.locator('.theme-toggle').focus()
    page.keyboard.press('Enter')
    expect_theme(page, 'light')
    assert page.evaluate('localStorage.getItem("dibya-theme")') == 'light'
    for path in paths:
        page.goto(base + path, wait_until='networkidle')
        expect_theme(page, 'light')
    print('PASS: default light theme, keyboard toggles, ARIA/meta, and persistence')

    for theme in ['light', 'dark']:
        page.goto(base, wait_until='networkidle')
        if page.locator('html').get_attribute('data-theme') != theme:
            page.locator('.theme-toggle').click()
        for path in paths:
            page.goto(base + path, wait_until='networkidle')
            expect_theme(page, theme)
            for width in [1440, 1024, 768, 390, 320]:
                page.set_viewport_size({'width': width, 'height': 900})
                angles = [0, 45, 90, 135] if path == 'index.html' else [None]
                for angle in angles:
                    if angle is not None:
                        page.locator('.portrait-orbit').evaluate('''(element, angle) => {
                            element.style.animation = 'none';
                            element.style.transform = `rotate(${angle}deg)`;
                        }''', angle)
                    assert page.evaluate(
                        'document.documentElement.scrollWidth <= innerWidth'
                    ), f'Overflow: {theme}, {path}, {width}px, orbit {angle}'
    print('PASS: three pages in both themes at five widths and four orbit angles')

    page.goto(base, wait_until='networkidle')
    assert page.locator('.toolkit>div>span').all_text_contents() == [
        'MATLAB', 'Simulink', 'Proteus', 'PSpice', 'AutoCAD', 'Arduino']
    page.goto(base + 'archive.html', wait_until='networkidle')
    expect(page.locator('.archive-documents>a')).to_have_count(5)
    for link in page.locator('.archive-documents>a').all():
        response = page.request.head(urljoin(base, link.get_attribute('href')))
        assert response.status == 200
        assert response.headers['content-type'].split(';')[0] == 'application/pdf'
    page.locator('[data-category="case-competitions"]').click()
    case_motion = page.get_by_role('button', name='AutoMech 2025 — CaseMotion', exact=True)
    expect(case_motion).to_be_visible()
    case_motion.click()
    expect(page.locator('#certificate-category')).to_have_text('Case competitions / 2025')
    expect(page.locator('#certificate-result')).to_have_text('Finalist')
    page.keyboard.press('Escape')
    page.locator('[data-category="engineering"]').click()
    expect(case_motion).to_have_count(0)
    print('PASS: five source PDFs, PSpice, and CaseMotion category retained')

    reduced = browser.new_context(reduced_motion='reduce')
    reduced_page = reduced.new_page()
    for path in paths:
        reduced_page.goto(base + path, wait_until='networkidle')
        assert reduced_page.evaluate('''() => [...document.querySelectorAll('*')].every(
            element => [null, '::before', '::after'].every(
                pseudo => getComputedStyle(element, pseudo).animationName === 'none'))''')
        expect(reduced_page.locator('.reveal-arrival')).to_have_count(0)
    reduced.close()

    no_script = browser.new_context(java_script_enabled=False)
    no_script_page = no_script.new_page()
    for path in paths:
        no_script_page.goto(base + path, wait_until='networkidle')
        expect(no_script_page.locator('.theme-toggle')).to_be_hidden()
    no_script_page.goto(base, wait_until='networkidle')
    expect(no_script_page.locator('#hero-title')).to_be_visible()
    expect(no_script_page.locator('#about')).to_be_visible()
    no_script.close()

    no_storage = browser.new_context()
    no_storage.add_init_script('''
        Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
        Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
    ''')
    no_storage_page = no_storage.new_page()
    no_storage_page.goto(base, wait_until='networkidle')
    expect_theme(no_storage_page, 'light')
    no_storage_page.locator('.theme-toggle').click()
    expect_theme(no_storage_page, 'dark')
    no_storage_page.locator('.theme-toggle').click()
    expect_theme(no_storage_page, 'light')
    no_storage.close()
    print('PASS: reduced motion, no-JavaScript fallback, and blocked storage')
    browser.close()
