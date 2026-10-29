# Add actual work to a project page

The homepage features seven projects. The original five report-backed projects retain their reports and repositories; separate Soccerbot and RC racing hardware pages now include component/tool inventories and original event-photo galleries. Code or repository links are included only when supplied.

EV Longitudinal Dynamics remains unfeatured until its Formula IUT models are supplied. The old combined RC Racing & Soccerbot URL remains an overview linking to `project.html?project=soccerbot` and `project.html?project=rc-racing`. Keep those separate hardware pages and their competition records distinct.

## Option 1: Create a repository for source files

1. Sign in to GitHub and choose **+ → New repository**.
2. Use a descriptive project name, such as `ev-longitudinal-dynamics` or `rc-racing-soccerbot`.
3. Choose **Public** if portfolio visitors should be able to see the files.
4. Select **Add a README file**, then **Create repository**.
5. Choose **Add file → Upload files** and upload the actual project files.
6. Edit the README to describe the project, required software, how to open/run it, the team, and your contribution. Add screenshots or documented results when available.
7. Copy the repository URL and link it from the matching portfolio project entry.

Each repository should contain the work for that specific project. Keep the portfolio itself in `github-portfolio`. GitHub's browser uploader accepts files up to 25 MB; larger project files can be shared through GitHub Releases or Git LFS when needed.

| Project | Existing material or useful additions |
| --- | --- |
| Stock Market Crash Simulator | Report, MATLAB source, repository, and dashboard/history/settings screenshots are linked. Future demos or updated reports can be added. |
| SAP-1 8-bit Computer | Report, native Proteus `.pdsprj`, repository, and circuit figures are linked. Add an actual simulation recording when available. |
| Residential Electrical Services | Report, presentation, editable `.dwg`, repository, and drawing extracts are linked. |
| Golf Streak | Report, MATLAB source, repository, and genuine gameplay images are linked. |
| EV, PHEV & HEV Literature Review | Original DOCX, 112-page browser reading PDF, repository, and battery-section figures are linked. Preserve all 11 co-author credits and the documented battery-section contribution. |
| EV Longitudinal Dynamics | Add original MATLAB scripts, Simulink models, model screenshots, and a report for the Formula IUT work. |
| RC Racing & Soccerbot | Add original Arduino sketches, wiring diagrams, build photos, or demonstration videos. Existing competition records remain in the achievement archive. |

## Option 2: Upload reports and images into the portfolio

Use a project folder such as `assets/projects/golf-streak/` for local reports, screenshots, and native files. They can be uploaded to this portfolio using **Add file → Upload files** without creating another repository.

For a new folder in GitHub's browser interface, use **Add file → Create new file** and create `assets/projects/YOUR_PROJECT/README.md` with a short source description. Commit it, open that folder, then choose **Add file → Upload files**. Upload the real assets and commit the changes. Existing project folders can be opened directly.

Preserve original documents and native project files. For derived browser copies or optimized images, keep the original available and label the conversion. The EV review follows this pattern: its original DOCX is unchanged, while its 112-page PDF is a browser reading copy with table-layout adjustments made during conversion.

## Update the matching entry in `projects.js`

Each entry has a unique, stable `slug`. Its existing URL is `project.html?project=SLUG`. Keep that slug when adding material so shared links continue to work.

The main content fields are `title`, `category`, `label`, `description`, `detail`, `role`, `context`, `contribution`, `overview` (paragraph strings), `focus` (strings), `highlights` (`value`/`label` objects), `tags`, and `evidence` (`label`/`url` source links). The `art` field identifies a conceptual illustration used when a real cover is absent. All seven current featured projects use actual covers. Hardware pages can also supply `components` as `{name, details}` rows, `tools` as strings, and an optional `buildNote`; empty groups remain hidden.

Use `credits` as an array of author names. Keep individual contributions distinct from the team's overall deliverables. `featured: false` preserves a detail page while excluding it from homepage cards and featured previous/next navigation; `true` includes it. An omitted `featured` value also includes the project.

The homepage filter categories are `simulation`, `hardware`, `design`, `software`, and `research`. A new category also needs a matching filter button in `index.html`.

The following example uses existing Golf Streak assets and shows the optional media/credit fields:

```js
featured: true,
credits: ['Shaheen Rahman Dibya'],
cover: {
  src: 'assets/projects/golf-streak/opening.webp',
  alt: 'Golf Streak opening gameplay view and challenge dashboard'
},
resources: [
  {
    label: 'Read the project report',
    kind: 'report',
    url: 'assets/projects/golf-streak/project-report.pdf',
    description: 'Original 12-page report with gameplay demonstrations.'
  },
  {
    label: 'View the GitHub repository',
    kind: 'repository',
    url: 'https://github.com/shaheendibya/MATLAB-GUI-Mini-Project-Golf-Streak'
  }
],
gallery: [
  {
    src: 'assets/projects/golf-streak/opening.webp',
    alt: 'Golf Streak Sector 1 with a ball, hole, trajectory preview, and dashboard',
    caption: 'Opening view of Sector 1. Original project report, page 8.'
  }
],
launch: {
  label: 'Run Golf Streak in MATLAB',
  instructions: 'Download or clone the repository, open MATLAB, and set the Current Folder to the directory containing golf_streak_procedural.m. Enter the command in the MATLAB Command Window.',
  requirements: 'MATLAB desktop with standard graphics and UI controls.',
  command: 'golf_streak_procedural'
}
```

Add files before linking them. Use relative URLs for portfolio assets and actual public URLs for external resources. Empty `resources`, `gallery`, or `credits` arrays keep their optional sections hidden.

### Resource types and page actions

Supported resource `kind` values are:

| Kind | Use |
| --- | --- |
| `report` | Main project report or browser reading PDF. The first report supplies the **Read report** hero action. |
| `repository` | Project repository homepage. The first repository supplies **View on GitHub**. |
| `code` | A specific source file or source-code location. |
| `presentation` | Slide deck or presentation PDF. |
| `files` | Native downloads such as AutoCAD `.dwg`, Proteus `.pdsprj`, or Word `.docx`. |
| `demo` | A working demonstration URL. |
| `video` | A real project recording. |

Local `.dwg`, `.pdsprj`, and `.docx` resources receive download links automatically. Reports and external links open in a new tab. Keep the project repository labeled `repository` so its hero action appears.

### Covers, galleries, and opening instructions

`cover` accepts `src` and `alt` and supplies the homepage card and detail-page hero image. `gallery` accepts `src`, `alt`, and an optional `caption` for each image. Use genuine project screenshots, drawings, or source-document figures. Cite the original document and page number in captions; for converted documents, identify the browser reading copy.

Visitors can enlarge gallery images in a native HTML dialog, move between them with the controls or arrow keys, open the original image, and close with Escape. Focus returns to the selected gallery button.

`launch` is optional. Its `label`, `instructions`, and `requirements` are strings; `command` is an optional string. A command adds a copy button. CAD/Proteus entries can provide opening instructions without a command. Confirm the filename and function entry point from the original source before documenting a MATLAB command. Portfolio browser checks do not establish that the native application has been run.

## Keep source provenance current

Update [PROJECT-SOURCES.json](PROJECT-SOURCES.json) when importing or refreshing work. Record the source repository, commit, original filenames, copied asset paths, available checksums, and figure page references. Describe any conversion that produced a browser copy.

The literature review preserves the original DOCX alongside its generated PDF. If that document changes, regenerate the reading copy, verify the complete text/tables/figures, and update its page count and gallery citations. The current review has 11 co-authors; Shaheen's documented contribution is the Battery & Energy Storage Systems section.

## Check and publish

After changing JavaScript or CSS, run `python3 scripts/version_assets.py` to refresh content-hash asset references.

Run the static site locally from the portfolio checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

With the environment's Python Playwright and Chromium available, run `python3 tests/smoke.py`. The browser checks cover all seven featured projects, preserved legacy URLs, real covers/media, report/repository hero actions, team credits, launch-command copying, native-file downloads, enlarged-gallery navigation, the achievement archive, and responsive layouts. They exercise the website; native MATLAB, Proteus, and AutoCAD projects require their own software and validation.

Commit and push changes to `main`, or use **Commit changes** after browser edits. In repository **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/ (root)**, and save. GitHub Pages publishes updates after the branch changes are deployed.

Portfolio: https://shaheendibya.github.io/github-portfolio/
