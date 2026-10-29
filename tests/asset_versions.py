"""Verify hashed asset URLs and bypass an obsolete unversioned achievement script."""
import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, unquote, urljoin, urlsplit
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]


class AssetReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == 'script' and attributes.get('src'):
            self.urls.append(attributes['src'])
        elif tag == 'link' and 'stylesheet' in attributes.get('rel', '').split():
            self.urls.append(attributes['href'])


checked = set()
for name in ['index.html', 'archive.html', 'project.html']:
    references = AssetReferences()
    references.feed((root / name).read_text())
    for url in references.urls:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc:
            continue
        asset = root / unquote(parts.path).lstrip('/')
        if asset.suffix not in {'.js', '.css'}:
            continue
        digest = hashlib.sha256(asset.read_bytes()).hexdigest()
        assert parse_qs(parts.query).get('v') == [digest[:12]], (name, url)
        if url not in checked:
            with urlopen(urljoin(base, url), timeout=10) as response:
                assert response.status == 200
                assert hashlib.sha256(response.read()).hexdigest() == digest, url
            checked.add(url)
print(f'PASS: all three pages reference current hashes; {len(checked)} versioned assets match HTTP bodies')

obsolete = 'window.portfolioAchievements = [{id: "obsolete-combined-iarco"}];'
bare_requests = []
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=args.chromium, headless=True, args=['--no-sandbox'])
    page = browser.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))

    def serve_obsolete(route):
        bare_requests.append(route.request.url)
        route.fulfill(status=200, content_type='application/javascript', body=obsolete)

    page.route('**/achievements.js', serve_obsolete)
    response = page.goto(base + 'achievements.js', wait_until='domcontentloaded')
    assert response.text() == obsolete and len(bare_requests) == 1
    page.goto(base + 'archive.html?search=IARCO%202026', wait_until='networkidle')
    assert len(bare_requests) == 1, 'The archive requested obsolete unversioned data'
    records = page.evaluate('window.portfolioAchievements.filter(record => record.id.startsWith("iarco-"))')
    assert len(records) == 1
    participation = records[0]
    assert participation['id'] == 'iarco-2026-participation'
    assert participation['kind'] == 'participation'
    assert [source['url'] for source in participation['sources']] == [
        'assets/documents/iarco-2026-participation.pdf']
    expect(page.locator('.archive-card')).to_have_count(1)
    page.locator('#archive-kind').select_option('award')
    expect(page.locator('.archive-card')).to_have_count(0)
    page.locator('#archive-kind').select_option('participation')
    expect(page.locator('.archive-card')).to_have_count(1)
    page.get_by_role('button', name=participation['title'], exact=True).click()
    expect(page.locator('#certificate-original')).to_have_attribute(
        'href', 'assets/documents/iarco-2026-participation.pdf#page=1')
    assert not errors, errors
    browser.close()
print('PASS: fresh archive bypasses obsolete bare data and lists only IARCO participation')
