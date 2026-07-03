# Portfolio Website — Developer Guide

## Overview

Single-page sci-fi "command console" portfolio. No build step — edit `index.html`, `css/styles.css`, `js/main.js` directly and refresh. Navigation is a fixed left icon rail (`.nav-rail`), not a top navbar; a HUD strip (`.hud-topbar`) sits above the content showing a live clock, status, and the current section.

## Content Customization

### Personal info / meta tags
**Location**: `index.html` `<head>` — update `<title>`, `<meta description>`, Open Graph/Twitter tags, and the JSON-LD `Person` block.

### Hero (`#hero`)
- The hero is a fake terminal window (`.hero-terminal`) — each `$ command` line is just a `<p class="term-line">`, followed by the "output". Add/remove lines directly in the markup.
- Name: `data-text` on `.glitch-name` **and** the text inside `.glitch-name-base` must match exactly.
- Role rotation: edit the `phrases` array in `js/main.js` → `initTypewriter()`.
- Stats: `data-count` on a `.stat-number` animates on load; `data-suffix` appends text. `#stat-repos` is filled live from the GitHub API — don't hardcode it.
- The ID badge (`.hero-id-badge`) is a separate hex-photo panel with `.id-row` key/value pairs — edit those directly.

### About (`#about`)
Plain paragraphs + an infinite CSS marquee (`.marquee-track`) for tech badges — the track has the badge list duplicated once so the loop is seamless; if you add/remove badges, duplicate the same change in both copies.

### Skills (`#skills`) — orbit constellation
Each `.orbit-node` is positioned with **only** inline CSS variables, no JS math:
```html
<div class="orbit-node" style="--angle:120deg;--radius:190px" data-name="React" data-level="Advanced · 85%">
  <div class="orbit-node-inner"><i class="fab fa-react"></i></div>
</div>
```
`--angle` + `--radius` place the node via `transform: rotate(var(--angle)) translateX(var(--radius))`; the inner element counter-rotates so the icon stays upright. Ring radii are fixed in CSS (`.orbit-ring-1/2/3` at 110/190/270px) — to add a node, pick a ring's radius and an angle that doesn't collide with siblings on that ring. `data-name`/`data-level` feed the hover tooltip (`initOrbitTooltip()` in `js/main.js`).
Below ~820px width the orbit is hidden and `.skills-fallback-list` (a plain list, already duplicating the same data) is shown instead — **keep both in sync** when you edit skills.

### Featured Projects (`#projects`) — drag-scroll deck
`.featured-card`s are hand-written, laid out in `#project-deck` (flex row, `scroll-snap-type: x`). `initProjectDeck()` in `js/main.js` wires up mouse-drag scrolling, the prev/next arrow buttons, and the progress bar. Use `.featured-badge-private` (no code link) for client/private work, `.featured-badge-public` (with `.project-links` buttons) for public repos. **Never link to a private repo.**

### Mission Log (`#timeline`) — horizontal timeline
`.h-timeline-item`s sit in a horizontally scrolling track (`.h-timeline-track`) below a glowing rail (`.h-timeline-rail`). No JS involved — it's native scroll with `scroll-snap-type: x proximity`. Keep entries factual; no fabricated employers or dates.

### Contact (`#contact`) — terminal CLI form
Visually a fake terminal (`.contact-terminal`), functionally a real form. Submits via `mailto:` from `initContactForm()` in `js/main.js` — no backend, no third-party form service, no fake success state.

## Live GitHub Data (`#github` section — "Live Telemetry")

`initGitHubData()` in `js/main.js` fetches:
- `GET /users/{username}` → profile stats
- `GET /users/{username}/repos?per_page=100` → repo list, used for total stars/forks, the language donut (`renderDonut`, based on each repo's primary `language` field to stay within the unauthenticated rate limit), and the repo ticker (`renderRepoTicker`)

**Radial gauges** (`setGauge()`): each gauge's ring fill is `value / softCap` clamped to 100% — the `softCap` numbers (50 repos, 50 stars, 30 followers, 40 forks) are purely a decorative visual scale so the rings have something to animate to, not a claim about a real maximum. The actual number is always shown as text in the gauge center — don't let the ring width imply false precision if you change these.

**Rate limits**: unauthenticated calls are capped at 60/hour per IP. A 403/network error shows a retry button (`location.reload()`) instead of leaving a stuck spinner.

To point this at a different GitHub account, change `GITHUB_USERNAME` near the top of `js/main.js`.

## Visual System (`css/styles.css`)

All colors/spacing are CSS custom properties on `:root` (`--cyan`, `--purple`, `--magenta`, `--bg`, `--rail-w`, `--topbar-h`) — re-theme or resize the chrome without touching component styles.

### Effects and where they live (all in `js/main.js` unless noted)
| Effect | Function / selector | Notes |
|---|---|---|
| Particle network background | `initParticleField()` | Canvas; particle count halves under 700px width; disabled under `prefers-reduced-motion` |
| Radar sweep | `.radar-sweep` (pure CSS) | Conic-gradient wedge rotating behind the hero ID badge |
| Custom reticle cursor | `initCustomCursor()` | Auto-disabled on touch/coarse pointers |
| 3D tilt | `initTilt()` | Any `.tilt` element |
| Magnetic pull | `initMagnetic()` | Any `.magnetic` element |
| Directional scroll reveal | `initScrollReveal()` | `.reveal` (fade-up), `.reveal-l` (from left), `.reveal-r` (from right) |
| HUD clock / section tracker / scroll progress | `initHud()` | Updates every second + on scroll |
| Orbit tooltips | `initOrbitTooltip()` | Reads `data-name`/`data-level` off each `.orbit-node` |
| Project deck drag/arrows/progress | `initProjectDeck()` | |
| Boot sequence preloader | `initBootSequence()` | Edit the `lines` array |

All motion effects check `prefers-reduced-motion` and either skip or short-circuit to a static state — don't remove those checks when editing.

## Layout Chrome

- `--rail-w` (default `84px`): width reserved for the sidebar nav rail via `body { padding-left: var(--rail-w) }`. Below 720px the rail becomes a bottom bar and `--rail-w` is set to `0` in the media query (padding moves to `padding-bottom` instead).
- `--topbar-h` (default `34px`): height of the HUD strip; `body { padding-top: var(--topbar-h) }`.
- If you change either variable's px value, update the matching `body` padding rule too — they're not automatically linked.

## SEO

- `sitemap.xml` — update `<lastmod>` when you materially change a section
- JSON-LD in `index.html` `<head>` — keep `knowsAbout` in sync with the Skills section

## Browser Support

Uses Canvas API, SVG, `IntersectionObserver`, CSS custom properties in `calc()`/`transform`, `backdrop-filter`, `scroll-snap-type` — all standard in current Chrome/Edge/Firefox/Safari. `backdrop-filter` degrades to a solid panel background in unsupported browsers.

## Troubleshooting

**GitHub section stuck on loading / shows retry button**: almost always a rate-limit (403) or offline network error — check DevTools console, wait an hour or check connectivity.

**Orbit nodes look misplaced or overlapping**: check the `--radius` matches the ring it's visually inside, and no two nodes on the same ring share (or nearly share) an `--angle`.

**Cursor reticle not appearing**: expected on touch devices — `initCustomCursor()` bails out via the `hover`/`pointer` media query.

**Glitch name not showing**: `data-text` on `.glitch-name` must exactly match `.glitch-name-base`'s text.

---
Made with vanilla HTML, CSS, and JavaScript.
