"""Version local JS/CSS references in the three portfolio pages by content hash."""
import argparse
import hashlib
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, unquote_plus, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index.html', 'archive.html', 'project.html')


def versioned_url(url, document):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc:
        return None
    path = unquote(parts.path)
    if Path(path).suffix.lower() not in {'.js', '.css'}:
        return None
    asset = (ROOT / path.lstrip('/') if path.startswith('/')
             else document.parent / path).resolve()
    if not asset.is_relative_to(ROOT):
        raise ValueError(f'Asset escapes repository: {url}')
    digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
    # Keep unrelated query parameters exactly as written, including their order.
    query = [part for part in parts.query.split('&')
             if unquote_plus(part.partition('=')[0]) != 'v'] if parts.query else []
    query.append(f'v={digest}')
    return urlunsplit(parts._replace(query='&'.join(query)))


class VersionReferences(HTMLParser):
    def __init__(self, text, document):
        super().__init__(convert_charrefs=True)
        self.document = document
        self.edits = []
        self.line_starts = [0]
        for line in text.splitlines(keepends=True):
            self.line_starts.append(self.line_starts[-1] + len(line))
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == 'script':
            attribute = 'src'
        elif tag == 'link' and 'stylesheet' in attributes.get('rel', '').lower().split():
            attribute = 'href'
        else:
            return
        url = attributes.get(attribute)
        if not url:
            return
        replacement = versioned_url(url, self.document)
        if replacement is None:
            return
        raw = self.get_starttag_text()
        pattern = (rf'(?<![\w:-]){attribute}\s*=\s*'
                   r'(?:(?P<quote>["\x27])(?P<quoted>.*?)(?P=quote)|(?P<unquoted>[^\s>]+))')
        match = re.search(pattern, raw, flags=re.IGNORECASE | re.DOTALL)
        if match is None:
            raise ValueError(f'Cannot locate {attribute} in {raw}')
        group = 'quoted' if match.group('quote') else 'unquoted'
        line, column = self.getpos()
        start = self.line_starts[line - 1] + column
        self.edits.append((start + match.start(group), start + match.end(group),
                           escape(replacement, quote=True)))


def update_page(document):
    original = document.read_text()
    parser = VersionReferences(original, document)
    updated = original
    for start, end, replacement in reversed(parser.edits):
        updated = updated[:start] + replacement + updated[end:]
    return original, updated


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true',
                        help='Exit nonzero if references need refreshing; never write files.')
    args = parser.parse_args()
    pending = []
    for name in PAGES:
        document = ROOT / name
        original, updated = update_page(document)
        if original != updated:
            pending.append((document, updated))
    if args.check:
        if pending:
            print('Stale asset versions: ' + ', '.join(path.name for path, _ in pending))
            return 1
        print('PASS: all local JS/CSS references have current content hashes')
        return 0
    for document, updated in pending:
        document.write_text(updated)
    print('Updated asset versions in: ' + ', '.join(path.name for path, _ in pending)
          if pending else 'Asset versions already current')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
