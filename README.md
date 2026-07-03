# Ravindra Valand — Portfolio Website

Live at **[vsmm-world.github.io](https://vsmm-world.github.io)** — a sci-fi "command console" themed personal portfolio built with vanilla HTML, CSS, and JavaScript (no framework, no build step, no dependencies beyond CDN fonts/icons).

## Features

- **Command console layout**: fixed left icon nav rail (not a top navbar), a HUD telemetry strip up top (live IST clock, status indicator, current-section readout, scroll progress), all content living in a full-height main column
- **Terminal-window hero**: identity presented as a typed terminal session (`whoami`, `role --current`, `stats --live`) next to a hex-clipped ID badge with a scanning line and live-updating data rows
- **Skill constellation**: skills rendered as an orbiting node diagram in three concentric rings (Expert / Advanced / Growing) around a central core, with hover tooltips — falls back to a plain list under 820px width
- **Drag-scroll project deck**: featured projects in a horizontally draggable, scroll-snapping deck with prev/next controls and a progress bar
- **Radial telemetry + donut chart**: GitHub stats as animated SVG radial gauges, language breakdown as an SVG donut chart, top repos as a compact ticker list
- **Horizontal "mission log" timeline**: career/project history scrolls sideways along a glowing rail instead of a vertical line
- **Terminal-CLI contact form**: styled as a shell prompt session, submits via `mailto:` (opens the visitor's email client) — no third-party backend, no fake "success" simulation
- **Sci-fi visual system**: deep-space canvas particle network reacting to the mouse, a rotating radar-sweep overlay, scanline/vignette overlays, glitch-text name, custom reticle cursor, 3D tilt cards, magnetic buttons — all respecting `prefers-reduced-motion` and auto-disabling on touch devices
- **Live GitHub data**: repos/stars/followers/forks, language breakdown, and top repos — all fetched live via the GitHub REST API, not hardcoded
- **Real content only**: no placeholder testimonials or fabricated employment history — About/Mission Log reflect actual freelance work and real repos
- SEO: meta tags, Open Graph, Twitter Card, JSON-LD structured data, `sitemap.xml`, `robots.txt`

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (Canvas API, SVG, IntersectionObserver)
- GitHub REST API (for the live telemetry section)
- Hosted on GitHub Pages

## Project Structure

```
index.html              # Main page markup
css/
└── styles.css           # Design system, HUD/rail/terminal/orbit/deck/gauge components, responsive layout
js/
└── main.js              # Particle canvas, cursor, tilt/magnetic, HUD clock, orbit tooltips, deck drag-scroll, GitHub API fetch, contact form
assets/
└── images/              # Profile images
sitemap.xml
robots.txt
LICENSE
```

## Running Locally

```bash
git clone https://github.com/vsmm-world/vsmm-world.github.io.git
cd vsmm-world.github.io
python -m http.server 8000   # or: npx http-server
```

Then open `http://localhost:8000`.

## Customizing / Extending

See **[PORTFOLIO_README.md](PORTFOLIO_README.md)** for the developer guide — updating content, tuning the orbit/deck/gauge components, adjusting the color system, and GitHub API rate-limit notes.

## Author

**Ravindra Valand**
- GitHub: [@vsmm-world](https://github.com/vsmm-world)
- LinkedIn: [Ravindra Valand](https://linkedin.com/in/ravindra-valand)
- Instagram: [@ravindra_valand](https://www.instagram.com/ravindra_valand/)

## License

See [LICENSE](LICENSE).
