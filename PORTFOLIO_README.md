# Portfolio Website — Developer Guide

## Overview

Single-page sci-fi themed portfolio. No build step — edit `index.html`, `css/styles.css`, `js/main.js` directly and refresh.

## Content Customization

### Personal info / meta tags
**Location**: `index.html` `<head>` — update `<title>`, `<meta description>`, Open Graph/Twitter tags, and the JSON-LD `Person` block (name, email, `sameAs` social links, `knowsAbout`).

### Hero section
**Location**: `index.html`, `#hero`
- Name: the `data-text` attribute on `.glitch-name` **and** the text inside `.glitch-name-base` must match exactly (the glitch effect duplicates this text via CSS `::before`/`::after`).
- Role rotation: edit the `phrases` array in `js/main.js` → `initTypewriter()`.
- Stats: `data-count` on a `.stat-number` animates to that number on load; `data-suffix` appends text (e.g. `+`). The repo count stat (`#stat-repos`) is filled live from the GitHub API instead — don't hardcode it.

### About
**Location**: `index.html`, `#about`. Plain paragraphs + `.tech-badge` pills — edit directly.

### Skills
**Location**: `index.html`, `#skills`. Each `.skill-card` needs an icon (Font Awesome class), a name, a level label, and `data-width` (0–100) on `.progress-bar` — the bar animates to that width when scrolled into view.

### Featured Projects
**Location**: `index.html`, `#projects`. Each `.featured-card` is hand-written (not API-driven) so you control the description and framing. Use `.featured-badge-private` (amber, no code link) for client/private work, `.featured-badge-public` (cyan, with `.project-links` → GitHub buttons) for public repos. **Never link to a private repo** — visitors without access will hit a 404.

### Timeline
**Location**: `index.html`, `#timeline`. Keep entries factual — this section intentionally does not include fabricated employer names or invented dates.

### Contact
Submits via `mailto:` from `js/main.js` → `initContactForm()` (builds a `mailto:` link from the form fields client-side — no backend, no third-party form service, no fake success state). If you want real inbox delivery without opening the visitor's mail client, you'd need to wire this to a form backend (e.g. Formspree) — that's a deliberate trade-off, not an oversight.

## Live GitHub Data (`#github` section)

`js/main.js` → `initGitHubData()` fetches:
- `GET /users/{username}` for profile stats (public repos, followers)
- `GET /users/{username}/repos?per_page=100` for the repo list — used to compute total stars/forks, the language breakdown (`renderLanguages`, based on each repo's primary `language` field, not per-file byte counts, to stay within the unauthenticated rate limit), and the top-6-by-stars project cards (`renderTopRepoCards`)

**Rate limits**: unauthenticated GitHub API calls are capped at 60/hour per IP. If the section shows an error, that's almost always the cause — it self-recovers after the window resets. There's a retry button wired to `location.reload()`.

To point this at a different GitHub account, change `GITHUB_USERNAME` near the top of `js/main.js`.

## Visual System (`css/styles.css`)

All colors/spacing are CSS custom properties on `:root` — change `--cyan`, `--purple`, `--magenta`, `--bg` etc. to re-theme without touching component styles.

### Effects and where they live (all in `js/main.js`)
| Effect | Function | Notes |
|---|---|---|
| Particle network background | `initParticleField()` | Canvas-based; particle count halves under 700px width; disabled under `prefers-reduced-motion` |
| Custom cursor | `initCustomCursor()` | Auto-disabled on touch/coarse pointers via `(hover: hover) and (pointer: fine)` |
| 3D tilt | `initTilt()` | Applies to any element with class `.tilt` |
| Magnetic pull | `initMagnetic()` | Applies to any element with class `.magnetic` |
| Scroll reveal | `initScrollReveal()` | Applies to any element with class `.reveal` |
| Boot sequence preloader | `initBootSequence()` | Edit the `lines` array to change the typed boot text |

All motion effects check `prefers-reduced-motion` and either skip or short-circuit to a static state — don't remove those checks when editing.

## SEO

- `sitemap.xml` — update `<lastmod>` when you materially change a section
- `robots.txt` — already permissive; no changes needed for a portfolio
- JSON-LD in `index.html` `<head>` — keep `knowsAbout` in sync with the Skills section

## Browser Support

Uses Canvas API, `IntersectionObserver`, CSS custom properties, `backdrop-filter` — all standard in current Chrome/Edge/Firefox/Safari. `backdrop-filter` degrades to a solid panel background in browsers without support; no polyfill needed.

## Troubleshooting

**GitHub section stuck on the loading spinner**: open DevTools console — almost always a rate-limit (403) or offline network error. Wait an hour or check connectivity.

**Cursor ring/dot not appearing**: expected on touch devices — `initCustomCursor()` bails out early via the `hover`/`pointer` media query.

**Glitch name effect not showing**: `data-text` on `.glitch-name` must exactly match the visible text in `.glitch-name-base`, or the `::before`/`::after` duplicate layers will show stale text.

---
Made with vanilla HTML, CSS, and JavaScript.
