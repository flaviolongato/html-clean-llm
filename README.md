# Clean & Download — HTML Snapshot Tool

A lightweight **bookmarklet/Chrome extension** that transforms any web page into a **lean, bot-friendly HTML snapshot** and downloads it as a file.

##The goal:
- Create a clean HTML to reduce the num. of tokens for LLMs to render a page, useful for extremely large websites. Can be used for example on a CDN such as cloudflare worker to strip html if user agent includes bot or llm.
- keep SEO and structured data signals, remove scripts/CSS/trackers/empty wrappers, normalise images, and output a **minified HTML file** that is smaller, faster, and easier for bots or LLMs to consume.

---

## ✨ Features

- 🚫 Removes:
  - All scripts (except JSON-LD)
  - CSS stylesheets and inline `<style>`
  - iframes, video/audio embeds, canvas, forms, `noscript`
  - Preload/preconnect hints
  - IDs, classes, inline styles, event handlers, `data-*`, `aria-*`, roles, tabindex
  - HTML comments
  - Empty containers (`<div>`, `<span>`, `<section>`, etc.) without text or meaningful children

- ✅ Keeps:
  - `<html lang>` / `dir` / `prefix`
  - `<title>`, canonical/alternate `<link>`
  - Standard SEO `<meta>` (description, robots, etc.)
  - **Open Graph** (`meta property="og:*"`)
  - **Twitter Cards** (`meta name="twitter:*"`)
  - **JSON-LD structured data** (`<script type="application/ld+json">`)
  - **Microdata** attributes (`itemscope`, `itemtype`, `itemprop`, `itemid`)
  - Semantic sections like `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>` (unless empty)

- 🖼️ Images:
  - Promotes lazy attributes (`data-src`, etc.) → `src`
  - Removes `srcset`/`sizes` (keeps single asset)
  - Flattens `<picture>` → `<img>` (keeps `alt`)

- ⚡ Optimisations:
  - Collapses whitespace and newlines
  - Serialises DOM → minified `<!doctype html><html>…</html>`
  - Downloads as `clean-<slug>.html`

---

## 📦 Installation

### Option A — Bookmarklet
1. Create a new browser bookmark.
2. Copy the **bookmarklet code** from [bookmarklet.js](./bookmarklet.js).
3. Paste it into the bookmark’s URL field.
4. Visit any page → click the bookmark → a cleaned `.html` file will download.

### Option B — Chrome Extension
1. Clone/download this repository.
2. Open **Chrome** → `chrome://extensions/`.
3. Enable **Developer mode** (toggle top right).
4. Click **Load unpacked** and select this project folder.
5. A new toolbar button appears. Click it on any page → downloads `clean-<slug>.html`.

---

## 🛠️ How It Works

1. **Prunes code & styles**  
   Removes scripts (except JSON-LD), CSS, and non-content embeds.

2. **Preserves SEO & structured data**  
   Keeps canonical, OG/Twitter, meta description, language, JSON-LD, and microdata.

3. **Normalises images**  
   Ensures every `<img>` has a usable `src`; simplifies `<picture>`.

4. **Cleans attributes**  
   Strips styling/behaviour attributes, keeping only SEO-relevant ones.

5. **Removes noise**  
   Deletes comments, collapses whitespace, removes empty wrappers.

6. **Exports**  
   Serialises to compact HTML and auto-downloads.

---

## 🔧 Configuration

- **Keep more attributes**: add to `keepGlobal` in `clean-and-download.js` (e.g., `"width"`, `"height"`).
- **Preserve `srcset`**: comment out the two lines that remove it in the image handler.
- **Aggressive cleanup**: extend/remove elements in the `rmAll(...)` selector list.
- **File name pattern**: change the `a.download =` line at the end.

---

## 📌 SEO Notes

- This tool is for **auditing, snapshots, or feeding clean HTML to bots/LLMs**.  
- It **does not cloak** by itself — it only runs locally in your browser.  
- If you publish cleaned versions, ensure they are publicly accessible and use `<link rel="canonical">` to point to the original if you don’t want them indexed.

---

## ⚠️ Limitations

- Cannot fetch content that only exists in JS runtime if it hasn’t rendered into the DOM.
- Media/iframe content is removed by design.
- Images are not recompressed; use an edge tool (e.g. Cloudflare Image Resizing) for smaller files.

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 🤝 Contributing

Pull requests welcome. Feel free to:
- Add support for Markdown export
- Add edge/server-side support (e.g., Cloudflare Worker)
- Extend image optimisation

---

## 🚀 Roadmap

- [ ] Optional **Markdown export** (`clean-<slug>.md`)
- [ ] Toggle between *HTML+Images* / *Text-only* modes
- [ ] Cloudflare Worker version to serve `/path.clean` at scale
