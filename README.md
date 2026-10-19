# Shaheen Rahman Dibya — Engineering portfolio

A responsive, static portfolio based on the supplied CV and achievement documents. Built with HTML, CSS, and JavaScript; no framework, build step, external font, API key, or backend is required.

## Run locally

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The main page is `index.html`; the complete searchable archive is `archive.html`. Each project opens a dedicated URL such as `project.html?project=stock-market-crash-simulator`. Relative asset paths support deployment under a GitHub Pages repository path.

## Content

- `index.html`: biography, featured achievements, research experience, education, and contact information.
- `projects.js`: shared content for all five projects, conceptual illustrations, optional files/repository links, and image galleries.
- `app.js`: clickable project cards, project filters, mobile navigation, and email copying.
- `project.html`, `project.js`, and `project.css`: individual project pages with overview, contribution, technical focus, source material, and previous/next navigation.
- `achievements.js`: the archive’s structured content, including 32 distinct records and their original-document references.
- `archive.js` and `archive.css`: search, category/year/type filters, accessible certificate previews, source switching, and responsive archive layouts.
- `style.css`: shared visual design and portfolio layouts.
- `assets/documents/`: the original CV, 29-page achievement collection, and Insignia certificate.
- `assets/certificates/`: optimized WebP certificate previews and thumbnails. Originals remain available as PDFs.

The archive includes 27 certificate-backed achievements and five CV-only distinctions/qualifications. Every certificate page is preserved. Three pairs of certificates document the same achievements and are grouped as multiple sources: the University Physics Competition, ACCELERATE RC Car, and BrandEdge. Participation, service, training, qualifications, and awards remain separately labeled. BrandEdge has no stated year and appears as undated.

To add an achievement, append a record in `achievements.js` with a unique `id`, `title`, `result`, `category`, `year` (or `null`), `kind`, `description`, and `sources`. Each source specifies `label`, `url`, `page`, and optional `image`, `thumbnail`, and `tabLabel`. Use original-document evidence for results and dates. Add files under `assets/` and keep URLs relative. Category and year options are derived from the records.

Project illustrations are conceptual diagrams, not photographs or measured project outputs. Project summaries describe the work documented in the CV. No actual project source files or reports have been supplied yet; their optional sections appear when real files/links are added. See [Adding project work](docs/ADDING-PROJECT-WORK.md) for GitHub repository creation and file-upload instructions.

## Browser verification

With the server running, the cloud environment’s existing Python Playwright and Chromium can run:

```sh
python3 tests/smoke.py
```

The test checks asset/PDF availability, project filters, all five project pages, whole-card and previous/next navigation, optional media/resources, missing-project states, clipboard success/fallback, all archive source-page references, category/year/type/search filters, multi-source certificate previews, CV-only records, empty states, mobile navigation, and layout at five viewport widths on the portfolio, archive, and project pages. Override `--base-url` or `--chromium` for another local setup. Playwright is a development check; the website itself needs no Python or browser automation dependencies.

## GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, then **main** and **/ (root)**, and save after the changes have been pushed.

Site: https://shaheendibya.github.io/github-portfolio/

Updating this checkout does not publish the site automatically.
