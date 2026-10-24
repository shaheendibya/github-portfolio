# Shaheen Rahman Dibya — Engineering portfolio

A responsive, static portfolio based on the supplied CV, achievement documents, and original project repositories. Built with HTML, CSS, and JavaScript; no framework, build step, external font, API key, or backend is required.

## Run locally

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. The main page is `index.html`; the searchable achievement archive is `archive.html`. Each project opens a dedicated URL such as `project.html?project=stock-market-crash-simulator`. Relative asset paths support deployment under a GitHub Pages repository path.

The interface keeps its cream-and-sage palette, serif headlines, and arched portrait, with floating navigation, original circuit linework, paper-like cards, and restrained motion. The moon button switches to a forest-green dark mode; the choice is remembered locally across the portfolio, archive, and project pages. Light mode remains the default. Motion respects the visitor's reduced-motion preference, and all decorative graphics are local assets.

## Featured project work

The homepage features five projects with original reports, repository links, authentic covers, and image galleries:

| Project | Available material and attribution |
| --- | --- |
| Stock Market Crash Simulator | Co-developed with Ishrak Samin. Original 13-page report, MATLAB source, and dashboard/history/settings screenshots. |
| SAP-1 8-bit Computer | Six-member Team Silicon 6 project simulated in Proteus. Original 24-page report, editable `.pdsprj` project, and circuit figures. |
| Residential Electrical Services | Group 4(C1) design. Original 31-page report, 33-page presentation, editable AutoCAD `.dwg`, and drawing extracts. |
| Golf Streak | Individual EEE 4416 mini-project. Original 12-page report, MATLAB source, and gameplay screenshots from the 10-level game. |
| EV, PHEV & HEV Literature Review | Eleven-co-author MCE 4391 review. Shaheen contributed the Battery & Energy Storage Systems section. Includes a 112-page browser reading PDF, unchanged original `.docx`, and battery-section figures. |

Project pages provide **Read report** and **View on GitHub** hero actions, team credits, documented contributions, source references, and opening/running instructions where applicable. Native `.dwg`, `.pdsprj`, and `.docx` resources download directly. Gallery images open in an accessible native dialog with enlarged previews, previous/next controls, keyboard navigation, and original-image links.

The EV review PDF was generated from the source DOCX for browser reading. Its table layout was adjusted in a temporary conversion copy to preserve text; the downloadable DOCX remains unchanged. Conversion details, repository commits, original filenames, and available checksums are recorded in [project provenance](docs/PROJECT-SOURCES.json).

EV Longitudinal Dynamics and RC Racing & Soccerbot retain their original project URLs and CV-based summaries with `featured: false`. Their Formula IUT models and robotics source files/photos can be added later, then `featured` can be set to `true`. They currently stay outside the homepage cards and featured-project navigation.

## Content

- `index.html`: biography, featured achievements, research experience, education, and contact information.
- `projects.js`: shared content for five featured projects and two preserved legacy pages, including credits, resources, covers, galleries, and optional launch instructions.
- `app.js`: clickable project cards, project filters, mobile navigation, and email copying.
- `project.html`, `project.js`, and `project.css`: individual project pages, report/repository actions, native downloads, launch-command copying, enlarged-image dialogs, and featured previous/next navigation.
- `achievements.js`: the archive's structured content, including 32 distinct records and original-document references.
- `archive.js` and `archive.css`: search, category/year/type filters, accessible certificate previews, source switching, and responsive archive layouts.
- `style.css`: shared visual design and portfolio layouts.
- `polish.css`, `detail-polish.css`, and `polish.js`: shared visual refinements, optional dark mode, reading progress, and motion enhancements. These load after the original styles and scripts.
- `assets/documents/`: the original CV, 29-page achievement collection, Insignia certificate, and complete 11-page IUT scan rotated upright.
- `assets/certificates/`: optimized WebP certificate previews and thumbnails. Originals remain available as PDFs.
- `assets/projects/`: project reports, authentic previews, CAD and Proteus source files, and the original review DOCX with its browser reading PDF.
- `docs/PROJECT-SOURCES.json`: repository and document provenance for the five featured projects.
- `docs/CERTIFICATE-SOURCES.json`: scan checksums, page replacements, and orientation corrections for the updated IUT certificates.
- `tests/smoke.py`: browser checks for the portfolio, archive, and project pages.

The archive includes 27 certificate-backed achievements and five CV-only distinctions/qualifications. Every certificate page is preserved. Three pairs document the same achievements and are grouped as multiple sources: the University Physics Competition, ACCELERATE RC Car, and BrandEdge. Participation, service, training, qualifications, and awards remain separately labeled. BrandEdge has no stated year and appears as undated.

Ten certificate pages in `lifelong-achievements.pdf` now use the replacement scans supplied in `Scanned iut certificates.pdf`, rotated upright without cropping or retouching. Their full-size previews and thumbnails were regenerated from the updated PDF. The collection retains its 29-page order and existing links; the other 19 pages are unchanged. The uploaded scan also contained a duplicate CaseMotion certificate with a blank recipient line; the named copy was used instead. Exact source-page mappings and checksums are recorded in [certificate provenance](docs/CERTIFICATE-SOURCES.json).

The source-document library also links the complete upright upload separately as [Scanned IUT certificates](assets/documents/scanned-iut-certificates.pdf). This 11-page PDF retains the uploaded order, including the duplicate page, alongside the updated lifelong collection.

To add an achievement, append a record in `achievements.js` with a unique `id`, `title`, `result`, `category`, `year` (or `null`), `kind`, `description`, and `sources`. Each source specifies `label`, `url`, `page`, and optional `image`, `thumbnail`, and `tabLabel`. Use original-document evidence for results and dates. Add files under `assets/` and keep URLs relative. Category and year options are derived from the records.

See [Adding project work](docs/ADDING-PROJECT-WORK.md) for GitHub repository creation, browser file uploads, the project-content schema, and instructions for adding the remaining Formula IUT and robotics material.

## Browser verification

With the server running, the cloud environment's existing Python Playwright and Chromium can run:

```sh
python3 tests/smoke.py
python3 tests/polish.py
```

The test checks:

- Five featured categories/pages, whole-card links, featured previous/next navigation, and both preserved legacy URLs.
- Actual covers and gallery images, report/repository hero actions, team credits, launch instructions, MATLAB-command copying, and local PDF/native-file availability.
- Download attributes for `.dwg`, `.pdsprj`, and `.docx`; enlarged-image dialogs, source captions, previous/next controls, Escape closing, and focus restoration.
- Resource filtering, missing-project states, email clipboard success/fallback, all 32 archive records and original document pages, archive filters, certificate source switching, and CV-only records.
- Portfolio/archive layouts at 1440, 1024, 768, 390, and 320px; all five featured project pages at 1440 and 320px; mobile navigation and JavaScript/resource errors.

Override `--base-url` or `--chromium` for another local setup, for example `python3 tests/smoke.py --base-url http://127.0.0.1:8002/`. These checks exercise the website in Chromium; they do not execute the MATLAB, Proteus, or AutoCAD projects. Playwright is a development check; the website itself needs no Python or browser automation dependencies.

The polish checks cover theme toggling and persistence, keyboard operation, light/dark layouts, decorative orbit bounds, reduced motion, disabled storage, and the no-JavaScript fallback.

## GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, then **main** and **/ (root)**, and save after the changes have been pushed.

Site: https://shaheendibya.github.io/github-portfolio/

Updating this checkout does not publish the site automatically.
