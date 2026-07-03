# Ravindra Valand — Portfolio Website

Live at **[vsmm-world.github.io](https://vsmm-world.github.io)** — a sci-fi themed, single-page personal portfolio built with vanilla HTML, CSS, and JavaScript (no framework, no build step, no dependencies beyond CDN fonts/icons).

## Features

- **Sci-fi visual system**: deep-space canvas particle network (reacts to the mouse), scanline overlay, neon cyan/purple glass panels, glitch-text hero name, terminal-style boot sequence preloader
- **Mouse interactivity**: custom cursor (dot + lagging ring that expands over links), 3D tilt on project/skill cards, magnetic buttons
- **Motion**: scroll-triggered reveals, animated skill bars, count-up stats, typewriter role text — all respect `prefers-reduced-motion`
- **Live GitHub data**: public repo count, total stars/forks, followers, a language breakdown computed from your repos, and a contribution heatmap — all fetched live via the GitHub REST API, not hardcoded
- **Real content only**: no placeholder testimonials or fabricated employment history — the About/Timeline sections reflect actual freelance work and real repos
- **Functional contact form**: submits via `mailto:` (opens the visitor's email client) — no third-party form backend, no fake "success" simulation
- SEO: meta tags, Open Graph, Twitter Card, JSON-LD structured data, `sitemap.xml`, `robots.txt`
- Accessible: semantic HTML, ARIA labels, keyboard navigation, custom cursor auto-disables on touch devices

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (Canvas API, IntersectionObserver)
- GitHub REST API (for the live stats/projects sections)
- Hosted on GitHub Pages

## Project Structure

```
index.html              # Main page markup
css/
└── styles.css           # Design system, sci-fi effects, responsive layout
js/
└── main.js              # Particle canvas, cursor, tilt/magnetic, reveals, GitHub API fetch, contact form
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

See **[PORTFOLIO_README.md](PORTFOLIO_README.md)** for the developer guide — updating content, tuning the particle/cursor effects, adjusting the color system, and the GitHub API rate-limit notes.

## Author

**Ravindra Valand**
- GitHub: [@vsmm-world](https://github.com/vsmm-world)
- LinkedIn: [Ravindra Valand](https://linkedin.com/in/ravindra-valand)
- Instagram: [@ravindra_valand](https://www.instagram.com/ravindra_valand/)

## License

See [LICENSE](LICENSE).
