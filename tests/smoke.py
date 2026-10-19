"""Exercise the portfolio, project pages, and archive in a real browser."""
import argparse
import json
from pathlib import Path
from urllib.request import Request, urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'

for path in ['index.html', 'style.css', 'app.js', 'archive.html', 'archive.css',
             'archive.js', 'achievements.js', 'projects.js', 'project.html',
             'project.js', 'project.css', 'assets/favicon.svg', 'assets/portrait.png']:
    with urlopen(base + path, timeout=10) as response:
        assert response.status == 200 and response.read(), path
for path in ['cv.pdf', 'lifelong-achievements.pdf', 'insignia-competition.pdf']:
    with urlopen(Request(base + 'assets/documents/' + path, method='HEAD'), timeout=10) as response:
        assert response.status == 200 and response.headers.get_content_type() == 'application/pdf', path
with urlopen(Request(base + 'assets/projects/stock-market-crash-simulator/project-report.pdf', method='HEAD'), timeout=10) as response:
    assert response.status == 200 and response.headers.get_content_type() == 'application/pdf'
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
    projects = page.evaluate('window.portfolioProjects')
    assert len(projects) == len({project['slug'] for project in projects}) == 5
    # Clicking a card's illustration must work as well as its title/arrow links.
    page.locator('.project-card').first.click(position={'x': 100, 'y': 80})
    expect(page.locator('#project-title')).to_have_text(projects[0]['title'])
    page.locator('.project-pagination-next').click()
    expect(page.locator('#project-title')).to_have_text(projects[1]['title'])
    for project in projects:
        page.goto(base, wait_until='networkidle')
        page.locator(f'.project-open[href="project.html?project={project["slug"]}"]').click()
        expect(page.locator('#project-title')).to_have_text(project['title'])
        expect(page).to_have_title(f'{project["title"]} — Shaheen Rahman Dibya')
        assert page.locator('#project-contribution').inner_text().strip()
        expect(page.locator('#project-tools span')).to_have_count(len(project['tags']))
        if project.get('cover'):
            expect(page.locator('#project-art img')).to_be_visible()
            page.locator('#project-art img').evaluate('(image) => image.decode()')
            assert page.locator('#project-art img').evaluate('(image) => image.naturalWidth > 0')
        else:
            expect(page.locator('#project-art svg')).to_be_visible()
        expect(page.locator('#project-nav a')).to_have_count(2)
        if project['resources']:
            expect(page.locator('#project-resources-section')).to_be_visible()
            expect(page.locator('#project-resources a')).to_have_count(len(project['resources']))
            for resource in project['resources']:
                expect(page.locator('#project-resources').get_by_role('link', name=resource['label'], exact=False)).to_have_attribute('href', resource['url'])
        else:
            expect(page.locator('#project-resources-section')).not_to_be_visible()
        if project['gallery']:
            expect(page.locator('#project-gallery-section')).to_be_visible()
            expect(page.locator('#project-gallery img')).to_have_count(len(project['gallery']))
            for image in page.locator('#project-gallery img').all():
                image.scroll_into_view_if_needed()
                image.evaluate('(image) => image.decode()')
                assert image.evaluate('(image) => image.naturalWidth > 0')
        else:
            expect(page.locator('#project-gallery-section')).not_to_be_visible()
        expect(page.locator('#project-evidence a[href="assets/documents/cv.pdf#page=1"]')).to_have_count(1)
        if project['slug'] == 'stock-market-crash-simulator':
            expect(page.locator('#project-contribution')).to_contain_text('Ishrak Samin')
            expect(page.locator('#project-resources a')).to_have_count(3)
            expect(page.locator('#project-resources a').nth(1)).to_have_attribute('href', 'https://github.com/shaheendibya/Stock-Market-Crash-Simulator/blob/main/Market_Crash_Dashboard.m')
    page.goto(base + 'project.html?project=unknown-project', wait_until='networkidle')
    expect(page.locator('#project-not-found')).to_be_visible()
    expect(page.locator('#project-content')).not_to_be_visible()
    page.goto(base + 'project.html', wait_until='networkidle')
    expect(page.locator('#project-not-found')).to_be_visible()
    expect(page.locator('#project-not-found h1')).to_have_text('Choose a project.')

    # Supplied project files/media are tested with local fixtures, without
    # publishing those fixtures as actual project work.
    fixture = (Path(__file__).resolve().parents[1] / 'projects.js').read_text()
    media = {
        'resources': [{'label': 'Fixture report', 'kind': 'report', 'url': 'assets/documents/cv.pdf'},
                      {'label': 'Invalid resource', 'url': 'javascript:void(0)'}],
        'gallery': [{'src': 'assets/portrait.png', 'alt': 'Fixture image', 'caption': 'Test media caption'}]
    }
    fixture += '\nObject.assign(window.portfolioProjects[2], ' + json.dumps(media) + ');'
    page.route('**/projects.js', lambda route: route.fulfill(status=200, content_type='application/javascript', body=fixture))
    page.goto(base + 'project.html?project=stock-market-crash-simulator', wait_until='networkidle')
    expect(page.locator('#project-resources a')).to_have_count(1)
    expect(page.locator('#project-resources a')).to_have_attribute('href', 'assets/documents/cv.pdf')
    expect(page.locator('#project-resources a')).to_have_attribute('target', '_blank')
    expect(page.locator('#project-gallery figcaption')).to_have_text('Test media caption')
    page.locator('#project-gallery img').scroll_into_view_if_needed()
    page.locator('#project-gallery img').evaluate('(image) => image.decode()')
    assert page.locator('#project-gallery img').evaluate('(image) => image.naturalWidth > 0')
    page.unroute('**/projects.js')

    page.goto(base, wait_until='networkidle')
    page.locator('#copy-email').click()
    expect(page.locator('#copy-status')).to_contain_text('Email copied')
    assert page.evaluate('navigator.clipboard.readText()') == 'shaheen.dibya17@gmail.com'
    page.evaluate("() => { navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); }; }")
    page.locator('#copy-email').click()
    expect(page.locator('#copy-status')).to_contain_text('Please select and copy')
    print('PASS: project filters, whole-card navigation, five detail pages, previous/next links, supplied media/resources, missing project states, and clipboard')

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

    for path in ['index.html', 'archive.html', 'project.html?project=stock-market-crash-simulator',
                 'project.html?project=rc-racing-soccerbot']:
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
    print('PASS: five desktop/mobile widths on portfolio/archive/project pages, mobile navigation, achievement deep link, no JavaScript or resource errors')
    browser.close()
