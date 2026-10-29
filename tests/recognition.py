"""Verify the supplied recognition photos, certificate sources, and accessible galleries."""
import argparse
from hashlib import sha256
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]
pdf = 'assets/documents/lifelong-achievements.pdf'
showcases = {
    'upc': {
        'section': '#upc-showcase',
        'page': 1,
        'images': [
            'assets/events/upc-2025/team-and-supervisor.webp',
            'assets/certificates/achievement-01.webp',
        ],
    },
    'iut': {
        'section': '#iut-excellence',
        'page': 29,
        'images': [
            'assets/events/iut-excellence-2026/team.webp',
            'assets/events/iut-excellence-2026/award-portrait.webp',
            'assets/certificates/achievement-29.webp',
        ],
    },
    'scholarship': {
        'section': '#class-ii-scholarship',
        'page': 22,
        'images': [
            'assets/events/class-ii-scholarship/helmut-kutin-award.webp',
            'assets/certificates/achievement-22.webp',
        ],
    },
}
photo_dimensions = {
    'assets/events/upc-2025/team-and-supervisor.webp': [1280, 960],
    'assets/events/iut-excellence-2026/team.webp': [960, 1280],
    'assets/events/iut-excellence-2026/award-portrait.webp': [960, 1280],
    'assets/events/class-ii-scholarship/helmut-kutin-award.webp': [1280, 768],
}


def gallery_links(page, group):
    return page.locator(f'{showcases[group]["section"]} .recognition-photo-link[data-gallery="{group}"]')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.on('response', lambda response: failures.append(
        f'{response.status}: {response.url}') if response.status >= 400 else None)
    page.goto(base, wait_until='networkidle')

    assert page.evaluate('''() => {
        const before = (left, right) => Boolean(document.querySelector(left)
            .compareDocumentPosition(document.querySelector(right)) & Node.DOCUMENT_POSITION_FOLLOWING);
        return before('#highlights', '#upc-showcase')
            && before('#upc-showcase', '#iut-excellence')
            && before('#iut-excellence', '#event-showcase')
            && before('#education', '#class-ii-scholarship')
            && before('#class-ii-scholarship', '.archive-banner');
    }'''), 'Recognition photos should keep the requested showcase priority'
    expect(page.locator('#upc-showcase')).to_contain_text(re.compile(r'silver', re.I))
    expect(page.locator('#upc-showcase')).to_contain_text(re.compile(r'Team\s+730', re.I))
    expect(page.locator('#upc-showcase')).to_contain_text(re.compile(r'supervisor|supervis|sponsor', re.I))
    expect(page.locator('#iut-excellence')).to_contain_text(re.compile(r'IUT\s+Excellence', re.I))
    expect(page.locator('#iut-excellence')).to_contain_text('2026')
    scholarship = page.locator('#class-ii-scholarship')
    expect(scholarship).to_contain_text(re.compile(r'Class\s+(?:II|2)\b', re.I))
    expect(scholarship).to_contain_text(re.compile(r'second|2nd', re.I))
    expect(scholarship).to_contain_text('Helmut Kutin')

    expect(page.locator('.recognition-photo-link')).to_have_count(7)
    galleries = {}
    asset_hashes = []
    for group, showcase in showcases.items():
        section = page.locator(showcase['section'])
        links = gallery_links(page, group)
        expect(links).to_have_count(len(showcase['images']))
        expect(section.locator(f'a[href="{pdf}#page={showcase["page"]}"]')).to_have_count(1)
        descriptors = []
        for link in links.all():
            image = link.locator('img')
            expect(image).to_have_count(1)
            href = link.get_attribute('href')
            assert href in showcase['images'] and not urlsplit(href).scheme
            expect(image).to_have_attribute('src', href)
            alt = image.get_attribute('alt')
            caption = link.get_attribute('data-caption')
            title = link.get_attribute('data-gallery-title')
            assert alt and alt.strip() and caption and caption.strip() and title and title.strip()
            image.scroll_into_view_if_needed()
            image.evaluate('(image) => image.decode()')
            dimensions = image.evaluate('(image) => [image.naturalWidth, image.naturalHeight]')
            if href in photo_dimensions:
                assert dimensions == photo_dimensions[href], (href, dimensions)
            else:
                assert max(dimensions) >= 1500, (href, dimensions)
            with urlopen(urljoin(base, href), timeout=15) as response:
                body = response.read()
                assert response.status == 200
                assert response.headers.get_content_type().startswith('image/')
                assert body == (root / href).read_bytes()
                asset_hashes.append(sha256(body).hexdigest())
            descriptors.append({'src': href, 'alt': alt, 'caption': caption, 'title': title})
        assert {image['src'] for image in descriptors} == set(showcase['images'])
        assert len({image['title'] for image in descriptors}) == 1
        galleries[group] = descriptors
    assert len(asset_hashes) == len(set(asset_hashes)), 'Recognition galleries contain duplicate image assets'
    print('PASS: four distinct supplied photographs, three full-size certificates, accurate source pages, and requested priority')

    dialog = page.locator('#recognition-dialog')
    expect(dialog).to_have_count(1)
    assert dialog.evaluate('(element) => element instanceof HTMLDialogElement')

    def expect_image(group, index):
        image = galleries[group][index]
        expect(dialog).to_be_visible()
        assert dialog.evaluate('(element) => element.open && element.matches(":modal")')
        preview = page.locator('#recognition-preview img')
        expect(preview).to_have_attribute('src', image['src'])
        expect(preview).to_have_attribute('alt', image['alt'])
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth > 0 && image.naturalHeight > 0')
        expect(page.locator('#recognition-title')).to_have_text(image['title'])
        expect(page.locator('#recognition-caption')).to_have_text(image['caption'])
        expect(page.locator('#recognition-count')).to_have_text(f'{index + 1} / {len(galleries[group])}')
        expect(page.locator('#recognition-original')).to_have_attribute('href', image['src'])

    for group, images in galleries.items():
        links = gallery_links(page, group)
        opener = links.first
        opener.scroll_into_view_if_needed()
        opener.focus()
        page.keyboard.press('Enter')
        expect_image(group, 0)
        page.keyboard.press('ArrowRight')
        expect_image(group, 1)
        page.keyboard.press('ArrowLeft')
        expect_image(group, 0)
        for index in range(1, len(images)):
            page.locator('#recognition-next').click()
            expect_image(group, index)
        page.locator('#recognition-prev').click()
        expect_image(group, len(images) - 2)
        page.keyboard.press('Escape')
        expect(dialog).to_be_hidden()
        expect(opener).to_be_focused()
        for index, link in enumerate(links.all()):
            link.click()
            expect_image(group, index)
            page.locator('.recognition-close').click()
            expect(dialog).to_be_hidden()
            expect(link).to_be_focused()
    print('PASS: all seven gallery entries, keyboard and button navigation, native modal dialogs, captions, original links, and focus restoration')

    page.goto(base + 'archive.html', wait_until='networkidle')
    records = page.evaluate('window.portfolioAchievements')
    assert len(records) == 33
    upc = next(record for record in records if record['id'] == 'achievement-01')
    assert upc['result'] == 'Silver medal'
    upc_sources = {(source['url'], source.get('page')) for source in upc['sources']}
    assert (pdf, 1) in upc_sources and (pdf, 29) in upc_sources
    class_ii = next(record for record in records if record['id'] == 'achievement-22')
    assert class_ii['year'] == 2012 and re.search(r'second', class_ii['result'], re.I)
    assert 'Helmut Kutin' in class_ii['description']
    assert [(source['url'], source.get('page')) for source in class_ii['sources']] == [(pdf, 22)]
    print('PASS: existing 33-record archive retains UPC/IUT evidence and the distinct Class II scholarship source')

    for theme in ['light', 'dark']:
        page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base, wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('data-theme', theme)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'home')
            for group in showcases:
                link = gallery_links(page, group).last
                link.scroll_into_view_if_needed()
                link.click()
                expect_image(group, len(galleries[group]) - 1)
                assert dialog.evaluate('(element) => element.scrollWidth <= element.clientWidth + 1'), (theme, width, group)
                bounds = dialog.bounding_box()
                assert bounds and bounds['x'] >= -1 and bounds['x'] + bounds['width'] <= width + 1, (theme, width, group, bounds)
                page.keyboard.press('Escape')
                expect(link).to_be_focused()

    no_script = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 1000})
    static_page = no_script.new_page()
    static_page.goto(base, wait_until='networkidle')
    for group, showcase in showcases.items():
        links = gallery_links(static_page, group)
        assert {link.get_attribute('href') for link in links.all()} == set(showcase['images'])
        expect(static_page.locator(showcase['section']).locator(
            f'a[href="{pdf}#page={showcase["page"]}"]')).to_have_count(1)
    no_script.close()
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: recognition showcases and dialogs fit four widths in both themes; original links work without JavaScript; no browser/resource errors')
