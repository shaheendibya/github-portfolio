# Add actual work to a project page

Each selected work opens an individual project page. The Stock Market Crash Simulator already has its repository, MATLAB source, report, and original report screenshots attached. Other project summaries use the supplied CV; the robotics page also links to the achievement archive. More code, reports, screenshots, and demos can be added separately. A GitHub repository is optional for reports and pictures.

## Option 1: Create a repository for source files

1. Sign in to GitHub and choose **+ → New repository**.
2. Use a descriptive name, such as `stock-market-crash-simulator` or `sap-1-computer`.
3. Choose **Public** if portfolio visitors should be able to see the files.
4. Select **Add a README file**, then **Create repository**.
5. Choose **Add file → Upload files** and upload the actual project files.
6. Edit the README to describe the project, required software, how to open/run it, and your contribution. Add screenshots or results when available.
7. Copy the repository URL. It can then be linked from the matching portfolio project page.

Do not upload the whole portfolio again into each project repository. Each repository should contain the files for that specific project. GitHub's browser uploader accepts files up to 25 MB; larger project files can be shared using GitHub Releases or Git LFS when needed.

Useful material for each work:

| Project | Examples of actual work to include |
| --- | --- |
| EV Longitudinal Dynamics | MATLAB scripts, Simulink model, model screenshots, report |
| SAP-1 8-bit Computer | Proteus project files, circuit screenshots, report, demonstration video |
| Stock Market Crash Simulator | MATLAB scripts, instructions, generated plots, report |
| Residential Electrical Services | AutoCAD drawing, exported PDF plans, load calculations |
| RC Racing & Soccerbot | Arduino sketches, wiring diagrams, photos, demonstration video |

## Option 2: Put reports and images in the portfolio

Use a folder such as `assets/projects/stock-market-crash-simulator/` for original project material. PDFs, screenshots, and images can be uploaded into this portfolio repository using **Add file → Upload files**. They do not need a separate repository.

## Link the material to the correct page

Project content is in `projects.js`. Each project has a stable `slug` and two optional arrays:

```js
resources: [
  {
    label: 'View project report',
    kind: 'report',
    url: 'assets/projects/stock-market-crash-simulator/report.pdf'
  },
  {
    label: 'View source code on GitHub',
    kind: 'code',
    url: 'https://github.com/YOUR_USERNAME/YOUR_PROJECT_REPOSITORY'
  }
],
gallery: [
  {
    src: 'assets/projects/stock-market-crash-simulator/results.png',
    alt: 'Describe what the actual project image shows',
    caption: 'A caption explaining the result or design'
  }
]
```

This is an example configuration. Add the actual files first, and replace example URLs with real links before saving them in `projects.js`. Available resource kinds are `code`, `report`, `demo`, `video`, and `files`. Empty arrays keep those sections hidden. The CV remains a source for the summary, and conceptual project diagrams remain explicitly labeled as illustrations.

An optional `cover` object with `src` and `alt` uses an actual project image on the homepage card and at the top of its detail page. Without a cover, the project keeps its labeled conceptual illustration.

The portfolio homepage links to all five project pages automatically. Commit and push the updated files to `main`; GitHub Pages will publish them if branch deployment is enabled.
