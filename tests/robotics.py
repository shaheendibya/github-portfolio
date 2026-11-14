"""Verify compact robotics award links, archived event photos, and supplied hardware lists."""
import argparse
from hashlib import sha256
from pathlib import Path
import re
from urllib.parse import parse_qs, urljoin, urlsplit
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]
expected_events = {'accelerate-2025': 5, 'techathon-2025': 5, 'eee-day-2025': 4}
expected_records = {'accelerate-2025': 'achievement-05', 'techathon-2025': 'achievement-04', 'eee-day-2025': 'cv-soccerbot-2025'}
builds = ['soccerbot', 'rc-racing']


def matching_part(project, pattern):
    matches = [part for part in project['components']
               if re.search(pattern, part['name'] + ' ' + part['details'], re.I)]
    assert len(matches) == 1, (project['slug'], pattern, matches)
    return matches[0]['name'] + ' ' + matches[0]['details']


def source_link(source):
    return source['url'] + (f'#page={source["page"]}' if source.get('page') and '#' not in source['url'] else '')


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
    page.goto(base, wait_until='networkidle')
    projects = page.evaluate('window.portfolioProjects')
    hardware = {project['slug']: project for project in projects if project['slug'] in builds}
    assert set(hardware) == set(builds)
    assert all(project.get('featured') is True for project in hardware.values())
    events = page.evaluate('window.portfolioEvents')
    assert {event['id']: len(event['gallery']) for event in events} == expected_events
    assert {event['id']: event['recordId'] for event in events} == expected_records
    photo_paths = {image['src'] for event in events for image in event['gallery']}
    assert len(photo_paths) == 14
    assert photo_paths <= {image['src'] for project in hardware.values() for image in project['gallery']}
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
    expect(page.locator('#event-grid a[data-event-id]')).to_have_count(3)
    expect(page.locator('#event-grid img, #event-grid .event-thumb, #event-grid button')).to_have_count(0)
    expect(page.locator('#event-dialog')).to_have_count(0)
    for event in events:
        card = page.locator(f'#event-grid a[data-event-id="{event["id"]}"]')
        expect(card).to_have_attribute('href', f'archive.html?record={event["recordId"]}')
        for text in [event['title'], event['result'], event['discipline']]:
            expect(card).to_contain_text(text)
    print('PASS: three compact award links and all 14 distinct photographs retained in event and project data')

    def expect_event_image(event, index):
        image = event['gallery'][index]
        preview = page.locator('#achievement-photo-preview img')
        expect(preview).to_have_attribute('src', image['src'])
        expect(preview).to_have_attribute('alt', image['alt'])
        preview.evaluate('(image) => image.decode()')
        assert preview.evaluate('(image) => image.naturalWidth > 0')
        expect(page.locator('#achievement-photo-caption')).to_have_text(image['caption'])
        expect(page.locator('#achievement-photo-original')).to_have_attribute('href', image['src'])
        expect(page.locator('#achievement-photo-count')).to_have_text(f'{index + 1} / {len(event["gallery"])}')
        expect(page.locator('.achievement-photo-thumb[aria-pressed="true"]')).to_have_count(1)
        expect(page.locator('.achievement-photo-thumb').nth(index)).to_have_attribute('aria-pressed', 'true')

    def expect_event_details(event):
        record = next(record for record in page.evaluate('window.portfolioAchievements') if record['id'] == event['recordId'])
        project = hardware[event['projectSlug']]
        expect(page.locator('#certificate-dialog')).to_be_visible()
        expect(page.locator('#certificate-title')).to_have_text(record['title'])
        expect(page.locator('#certificate-result')).to_have_text(record['result'])
        expect(page.locator('#certificate-event-details')).to_be_visible()
        expect(page.locator('#certificate-event-jump')).to_be_visible()
        expect(page.locator('#certificate-event-jump')).to_have_attribute('href', '#certificate-event-details')
        expect(page.locator('#achievement-event-title')).to_have_text(event['title'])
        expect(page.locator('.achievement-photo-thumb')).to_have_count(len(event['gallery']))
        expect(page.locator('#achievement-components th')).to_have_text([part['name'] for part in project['components']])
        expect(page.locator('#achievement-components td')).to_have_text([part['details'] for part in project['components']])
        expect(page.locator('#achievement-tools li')).to_have_text(project['tools'])
        expect(page.locator('#achievement-build-link')).to_have_attribute('href', f'project.html?project={project["slug"]}')
        expect(page.locator('#certificate-event-details').get_by_role('link', name=re.compile(r'GitHub|source code|read report', re.I))).to_have_count(0)
        expect(page.locator('#certificate-original')).to_have_attribute('href', source_link(record['sources'][0]))
        wait_record_url(page, event['recordId'])
        assert parse_qs(urlsplit(page.url).query).get('record') == [event['recordId']]
        assert page.evaluate('''() => Boolean(document.querySelector('.certificate-dialog-content')
            .compareDocumentPosition(document.querySelector('#certificate-event-details')) & Node.DOCUMENT_POSITION_FOLLOWING)''')
        expect_event_image(event, 0)
        return record

    def expect_cleared_details():
        expect(page.locator('#certificate-event-details')).to_be_hidden()
        expect(page.locator('#certificate-event-jump')).to_be_hidden()
        expect(page.locator('.achievement-photo-thumb')).to_have_count(0)
        expect(page.locator('#achievement-components tr')).to_have_count(0)
        expect(page.locator('#achievement-tools li')).to_have_count(0)
        assert page.locator('#achievement-photo-preview img').get_attribute('src') is None
        assert page.locator('#achievement-photo-original').get_attribute('href') is None
        assert page.locator('#achievement-build-link').get_attribute('href') is None
        expect(page.locator('#achievement-photo-caption')).to_have_text('')

    for event in events:
        page.goto(base, wait_until='networkidle')
        card = page.locator(f'#event-grid a[data-event-id="{event["id"]}"]')
        card.scroll_into_view_if_needed()
        card.click()
        assert urlsplit(page.url).path.endswith('/archive.html')
        record = expect_event_details(event)
        page.locator('#certificate-event-jump').click()
        expect(page.locator('#achievement-event-title')).to_be_in_viewport()
        assert parse_qs(urlsplit(page.url).query).get('record') == [event['recordId']]
        expect(page.locator('#achievement-photo-prev')).to_be_disabled()
        for index in range(1, len(event['gallery'])):
            page.locator('#achievement-photo-next').click()
            expect_event_image(event, index)
        expect(page.locator('#achievement-photo-next')).to_be_disabled()
        page.locator('#achievement-photo-prev').click()
        expect_event_image(event, len(event['gallery']) - 2)
        for index, thumbnail in enumerate(page.locator('.achievement-photo-thumb').all()):
            expect(thumbnail).to_have_accessible_name(re.compile(r'photograph', re.I))
            thumbnail.click()
            expect_event_image(event, index)
        # Document tabs continue to select PDFs without changing the event photograph.
        expect(page.locator('#certificate-source-nav button')).to_have_count(len(record['sources']))
        if len(record['sources']) > 1:
            for index, source in enumerate(record['sources']):
                page.locator('#certificate-source-nav button').nth(index).click()
                expect(page.locator('#certificate-original')).to_have_attribute('href', source_link(source))
                expect_event_image(event, len(event['gallery']) - 1)
        page.keyboard.press('Escape')
        expect(page.locator('#certificate-dialog')).to_be_hidden()
        expect_cleared_details()
        wait_record_url(page)
        assert 'record' not in parse_qs(urlsplit(page.url).query)
        page.get_by_role('button', name='University Physics Competition 2025', exact=True).click()
        expect(page.locator('#certificate-title')).to_have_text('University Physics Competition 2025')
        expect_cleared_details()
        page.keyboard.press('Escape')
        wait_record_url(page)
    print('PASS: whole-card navigation opens the matching archive award, exact event photos/components/tools, source tabs, and cleared nonrobotics records')

    # A deep link works when active filters exclude the record; closing preserves those filters.
    event = by_id['techathon-2025']
    page.goto(base + 'archive.html?search=scholarship&category=academics&record=achievement-04#archive-grid', wait_until='networkidle')
    expect_event_details(event)
    page.locator('.certificate-close').click()
    expect(page.locator('#certificate-dialog')).to_be_hidden()
    wait_record_url(page)
    assert parse_qs(urlsplit(page.url).query) == {'search': ['scholarship'], 'category': ['academics']}
    assert urlsplit(page.url).fragment == 'archive-grid'
    expect(page.locator('#archive-search')).to_have_value('scholarship')
    expect(page.locator('.archive-category[data-category="academics"]')).to_have_attribute('aria-pressed', 'true')
    expect(page.locator('#archive-search')).to_be_focused()
    expect_cleared_details()
    page.goto(base + 'archive.html?search=Techathon&record=not-a-real-achievement', wait_until='networkidle')
    expect(page.locator('#certificate-dialog')).to_be_hidden()
    expect(page.locator('.archive-card')).to_have_count(1)
    expect_cleared_details()
    page.goto(base + 'archive.html?search=Techathon', wait_until='networkidle')
    trigger = page.locator('.archive-card-title')
    trigger.click()
    expect_event_details(event)
    page.go_back()
    expect(page.locator('#certificate-dialog')).to_be_hidden()
    wait_record_url(page)
    assert parse_qs(urlsplit(page.url).query) == {'search': ['Techathon']}
    page.go_forward()
    expect_event_details(event)
    page.locator('.certificate-close').click()
    wait_record_url(page)
    expect(trigger).to_be_focused()
    assert parse_qs(urlsplit(page.url).query) == {'search': ['Techathon']}
    page.go_forward()
    expect_event_details(event)
    page.go_back()
    expect(page.locator('#certificate-dialog')).to_be_hidden()
    wait_record_url(page)
    assert parse_qs(urlsplit(page.url).query) == {'search': ['Techathon']}
    print('PASS: direct links, invalid IDs, click/history navigation, focus, and filter-preserving close behavior')

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
            expect(page.locator('#event-grid a[data-event-id]')).to_have_count(3)
            expect(page.locator('#event-grid img, #event-grid .event-thumb')).to_have_count(0)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width, 'compact events')
            for event in events:
                page.goto(base + f'archive.html?record={event["recordId"]}', wait_until='networkidle')
                expect_event_details(event)
                page.locator('.achievement-photo-thumb').last.click()
                expect_event_image(event, len(event['gallery']) - 1)
                assert page.locator('#certificate-dialog').evaluate('(dialog) => dialog.scrollWidth <= dialog.clientWidth + 1'), (theme, width, event['id'])
                assert page.locator('#achievement-components-section').evaluate('(element) => element.scrollWidth <= element.clientWidth + 1'), (theme, width, event['id'], 'components')
                page.keyboard.press('Escape')
                wait_record_url(page)
    assert not errors, errors
    assert not failures, failures
    browser.close()
print('PASS: compact homepage links and full archive photos/build details fit desktop/mobile in both themes with no browser/resource errors')
