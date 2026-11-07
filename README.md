# Nirakar — portfolio website

A static site: plain HTML, CSS and JavaScript. It has no build step and no framework. Smooth scrolling comes from Lenis, and the animations come from GSAP and ScrollTrigger. Both are stored in `assets/vendor`, so the site works offline.

## Folder map

| Path | What it is |
|---|---|
| `index.html` | Home page: loader, hero, showcase, crafts, index, studio, contact |
| `project.html` | One template for every project page (`project.html?p=<slug>`) |
| `content/projects.js` | **All the text and project data.** Edit this file to change the site |
| `media/<slug>/` | Web-ready images (`.webp`) and videos (`.mp4`) for each project |
| `assets/` | CSS, JS, fonts, logo, vendor libraries |
| `_tools/` | Helper scripts (media compressor, preview server). Not part of the site |

## Preview it on this PC

```bash
cd "D:\PORTFOLIO for game and studio\website\_tools"
```

```bash
node serve.mjs
```

Then open http://localhost:5173.

## Add or update a project

1. Open `_tools/build-media.mjs`, add the project's original image and video paths to `MEDIA`, and run:
   ```bash
   node build-media.mjs <slug>
   ```
   It writes compressed copies to `media/<slug>/` and never touches your originals.
2. In `content/projects.js`, copy an existing project block, change `slug`, the text and the media names, and set `status`.
3. Refresh the browser. The project appears in the showcase, the index, the crafts counts, and gets its own page.

To keep a project out of the showcase, set `featured: false`. It still appears in the index.

## Change the look

The colours and fonts are tokens at the top of `assets/css/style.css`. To change the accent colour, edit `--accent`.

## Going live (when the domain is ready)

Upload everything except `_tools/node_modules` to any static host, such as Netlify, Cloudflare Pages, Vercel or GitHub Pages, and point the domain at it. Keep large showreels under about 20 MB each, or host them on YouTube or Vimeo.
