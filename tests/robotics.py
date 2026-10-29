"""Verify the curated robotics wins, authentic photos, and supplied hardware lists."""
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
expected_events = {'accelerate-2025': 5, 'techathon-2025': 5, 'eee-day-2025': 4}
builds = ['soccerbot', 'rc-racing']


def matching_part(project, pattern):
    matches = [part for part in project['components']
               if re.search(pattern, part['name'] + ' ' + part['details'], re.I)]
    assert len(matches) == 1, (project['slug'], pattern, matches)
    return matches[0]['name'] + ' ' + matches[0]['details']


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.on('response', lambda response: failures.append(f'{response.status}: {response.url}') if response.status >= 400 else None)
    page.goto(base, wait_until='networkidle')
    projects = page.evaluate('window.portfolioProjects')
    hardware = {project['slug']: project for project in projects if project['slug'] in builds}
    assert set(hardware) == set(builds)
    assert all(project.get('featured') is True for project in hardware.values())
    events = page.evaluate('window.portfolioEvents')
    assert {event['id']: len(event['gallery']) for event in events} == expected_events
    assert len({image['src'] for event in events for image in event['gallery']}) == 14
    assert all(event['projectSlug'] in builds for event in events)
    by_id = {event['id']: event for event in events}
    assert re.search(r'first|1st', by_id['accelerate-2025']['result'], re.I)
    assert re.search(r'champion', by_id['techathon-2025']['result'], re.I)
    assert re.search(r'champion', by_id['eee-day-2025']['result'], re.I)
    assert by_id['eee-day-2025']['projectSlug'] == 'soccerbot'
    assert by_id['accelerate-2025']['projectSlug'] == by_id['techathon-2025']['projectSlug'] == 'rc-racing'

    hashes = []
    for event in events:
        for image in event['gallery']:
            assert image['alt'].strip() and image['caption'].strip()
            assert not urlsplit(image['src']).scheme
            with urlopen(urljoin(base, image['src']), timeout=15) as response:
                body = response.read()
                assert response.status == 200 and response.headers.get_content_type().startswith('image/')
                assert body == (root / image['src']).read_bytes()
                hashes.append(sha256(body).hexdigest())
    assert len(hashes) == len(set(hashes)), 'Duplicate photo files slipped into the curated events'
    print('PASS: three accurately labeled winning events, 14 unique curated images, and available original assets')

    def expect_event_image(event, index):
        image = event['gallery'][index]
        preview = page.locator('#event-preview img')
        expect(preview).to_have_attribute('src', image['src'])
        expect(preview).to_have_attribute('alt', image['alt'])
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth > 0')
        expect(page.locator('#event-title')).to_have_text(f'{event["title"]} · {event["discipline"]}')
        expect(page.locator('#event-caption')).to_have_text(image['caption'])
        expect(page.locator('#event-original')).to_have_attribute('href', image['src'])

    for event in events:
        card = page.locator(f'.event-card[data-event-id="{event["id"]}"]')
        expect(card).to_contain_text(event['title'])
        opener = card.locator('.event-cover')
        opener.scroll_into_view_if_needed()
        opener.click()
        expect(page.locator('#event-dialog')).to_be_visible()
        expect_event_image(event, 0)
        page.keyboard.press('ArrowRight')
        expect_event_image(event, 1)
        page.keyboard.press('ArrowLeft')
        expect_event_image(event, 0)
        page.locator('#event-next').click()
        expect_event_image(event, 1)
        page.keyboard.press('Escape')
        expect(page.locator('#event-dialog')).to_be_hidden()
        expect(opener).to_be_focused()
        thumbnail = card.locator('.event-thumb').last
        thumbnail.click()
        expect_event_image(event, len(event['gallery']) - 1)
        page.locator('.event-close').click()
        expect(thumbnail).to_be_focused()
    print('PASS: event image dialogs, captions, keyboard navigation, original links, and focus restoration')

    soccerbot = hardware['soccerbot']
    assert re.search(r'Arduino\s+Uno', matching_part(soccerbot, r'Arduino'), re.I)
    motor = matching_part(soccerbot, r'25\s*mm')
    assert re.search(r'\b4\b', motor) and '500' in motor and '600' in motor
    assert re.search(r'\b4\b', matching_part(soccerbot, r'65\s*mm'))
    assert re.search(r'\b3\b', matching_part(soccerbot, r'L298'))
    assert re.search(r'\b2\b', matching_part(soccerbot, r'buck'))
    assert re.search(r'\b2\b', matching_part(soccerbot, r'bluetooth'))
    rc = hardware['rc-racing']
    assert re.search(r'ESP32', matching_part(rc, r'ESP32'), re.I)
    assert '7960' in matching_part(rc, r'7960')
    assert re.search(r'37\s*GB', matching_part(rc, r'37\s*GB'), re.I)
    battery = matching_part(rc, r'Li.?po')
    assert re.search(r'12\s*V', battery, re.I) and re.search(r'2200\s*mAh', battery, re.I)
    assert re.search(r'\b4\b', matching_part(rc, r'wheel'))

    for slug, project in hardware.items():
        assert not project.get('launch')
        assert not any(resource['kind'] in {'code', 'report', 'repository'} for resource in project['resources'])
        assert 3 <= len(project['gallery']) <= 12
        for theme in ['light', 'dark']:
            page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
            for width in [1440, 768, 390, 320]:
                page.set_viewport_size({'width': width, 'height': 1000})
                page.goto(base + f'project.html?project={slug}', wait_until='networkidle')
                expect(page.locator('#project-build-section')).to_be_visible()
                expect(page.locator('#project-components th')).to_have_text([part['name'] for part in project['components']])
                expect(page.locator('#project-components td')).to_have_text([part['details'] for part in project['components']])
                expect(page.locator('#project-build-tools li')).to_have_text(project['tools'])
                expect(page.locator('#project-launch-section')).to_be_hidden()
                expect(page.locator('#project-actions').get_by_role('link', name=re.compile(r'GitHub|source code|read report', re.I))).to_have_count(0)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (slug, theme, width)
    print('PASS: separate hardware builds, supplied quantities/specifications, accessible tables/tools, and no invented code resources')

    for theme in ['light', 'dark']:
        page.evaluate('(theme) => localStorage.setItem("dibya-theme", theme)', theme)
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base + '#event-showcase', wait_until='networkidle')
            expect(page.locator('#event-grid .event-card')).to_have_count(3)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'event showcase')
            first = page.locator('.event-cover').first
            first.click()
            expect(page.locator('#event-dialog')).to_be_visible()
            assert page.locator('#event-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1')
            page.keyboard.press('Escape')
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: event showcase and image dialog fit desktop/mobile in both themes with no browser/resource errors')
