# Ravindra Valand — Portfolio Website

Live at **[vsmm-world.github.io](https://vsmm-world.github.io)** — a modern, fully-responsive personal portfolio built with vanilla HTML, CSS, and JavaScript (no framework, no build step).

## Features

- Single-page layout with smooth scrolling between sections (Hero, About, Skills, Projects, Experience, Contact)
- Dark/light mode toggle with system preference detection
- GitHub-integrated project cards (fetches repos live via the GitHub API) with modal detail views
- Animated sections and micro-interactions (`IntersectionObserver`, `requestAnimationFrame`)
- SEO-optimized: meta tags, Open Graph, Twitter Card, JSON-LD structured data, `sitemap.xml`, `robots.txt`
- Accessible: semantic HTML, ARIA labels, full keyboard navigation, WCAG 2.1 AA color contrast
- Performance-tuned for 85+ Lighthouse scores (lazy-loaded images, optimized assets)

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- GitHub REST API (for the live projects section)
- Hosted on GitHub Pages

## Project Structure

```
index.html              # Main page markup
css/
└── styles.css
js/
└── main.js              # Section behavior, theme toggle, GitHub API fetch
assets/
└── images/              # Profile image, icons, OG image
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

See **[PORTFOLIO_README.md](PORTFOLIO_README.md)** for the full developer guide — content customization (hero, about, skills, timeline), adding projects manually vs. via GitHub auto-fetch, SEO configuration, performance/accessibility checklists, and troubleshooting.

## Author

**Ravindra Valand**
- GitHub: [@vsmm-world](https://github.com/vsmm-world)
- LinkedIn: [Ravindra Valand](https://linkedin.com/in/ravindra-valand)
- Instagram: [@ravindra_valand](https://www.instagram.com/ravindra_valand/)

## License

See [LICENSE](LICENSE).
