/* ============================================================
   RAVINDRA VALAND — SCI-FI COMMAND CONSOLE PORTFOLIO
   Nav rail + HUD telemetry, particle background, custom reticle
   cursor, tilt/magnetic, directional scroll reveals, orbit
   constellation tooltips, drag-scroll project deck, radial
   gauges + donut chart, live GitHub data, terminal contact form.
   ============================================================ */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------------- boot sequence ---------------- */
    function initBootSequence() {
        const el = document.getElementById('boot-lines');
        const preloader = document.getElementById('preloader');
        if (!el || !preloader) return;

        const lines = [
            '> booting command_console.sys',
            '> loading modules .......... [OK]',
            '> establishing uplink ....... [OK]',
            '> calibrating HUD ........... [OK]',
            '> welcome, visitor.'
        ];

        if (prefersReducedMotion) {
            el.textContent = lines.join('\n');
            setTimeout(() => hidePreloader(preloader), 400);
            return;
        }

        let lineIndex = 0, charIndex = 0, out = '';
        function typeNext() {
            if (lineIndex >= lines.length) {
                el.innerHTML = out + '<span class="boot-caret">_</span>';
                setTimeout(() => hidePreloader(preloader), 500);
                return;
            }
            const currentLine = lines[lineIndex];
            if (charIndex <= currentLine.length) {
                el.textContent = out + currentLine.slice(0, charIndex);
                charIndex++;
                setTimeout(typeNext, 14);
            } else {
                out += currentLine + '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNext, 110);
            }
        }
        typeNext();
    }
    function hidePreloader(preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }

    /* ---------------- particle network canvas ---------------- */
    function initParticleField() {
        const canvas = document.getElementById('fx-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, particles;
        const mouse = { x: null, y: null };
        const isSmall = window.innerWidth < 700;
        const density = prefersReducedMotion ? 0 : (isSmall ? 40 : 85);

        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        function makeParticles() {
            particles = Array.from({ length: density }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.6
            }));
        }
        resize(); makeParticles();
        window.addEventListener('resize', () => { resize(); makeParticles(); });
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        function tick() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                if (mouse.x !== null) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        const force = (130 - dist) / 130;
                        p.x += (dx / dist) * force * 0.6;
                        p.y += (dy / dist) * force * 0.6;
                    }
                }
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 242, 0.55)'; ctx.fill();
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 118) {
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.18 * (1 - dist / 118)})`;
                        ctx.lineWidth = 1; ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        }
        if (!prefersReducedMotion) requestAnimationFrame(tick);
    }

    /* ---------------- custom reticle cursor ---------------- */
    function initCustomCursor() {
        if (!hasFinePointer) return;
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });
        function raf() {
            rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        document.querySelectorAll('a, button, .tilt, .magnetic, .orbit-node-inner').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('active'));
            el.addEventListener('mouseleave', () => ring.classList.remove('active'));
        });
    }

    /* ---------------- 3D tilt ---------------- */
    function initTilt() {
        if (!hasFinePointer || prefersReducedMotion) return;
        document.querySelectorAll('.tilt').forEach(card => {
            if (card.dataset.tiltBound) return;
            card.dataset.tiltBound = '1';
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)'; });
        });
    }

    /* ---------------- magnetic buttons ---------------- */
    function initMagnetic() {
        if (!hasFinePointer || prefersReducedMotion) return;
        document.querySelectorAll('.magnetic').forEach(el => {
            if (el.dataset.magBound) return;
            el.dataset.magBound = '1';
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
        });
    }

    /* ---------------- directional scroll reveal ---------------- */
    function initScrollReveal() {
        const items = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
        if (!items.length) return;
        if (prefersReducedMotion) { items.forEach(el => el.classList.add('visible')); return; }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        items.forEach(el => observer.observe(el));
    }

    /* ---------------- count-up ---------------- */
    function animateCount(el, target, suffix) {
        const duration = 1400;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + (suffix || '');
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    animateCount(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => observer.observe(el));
    }

    /* ---------------- typewriter ---------------- */
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;
        const phrases = ['Full Stack Developer', 'NestJS & Node.js Backend', 'React Frontend Engineer', 'Freelance / 3 Years Experience'];
        if (prefersReducedMotion) { el.textContent = phrases[0]; return; }
        let phraseIndex = 0, charIndex = 0, deleting = false;
        function tick() {
            const phrase = phrases[phraseIndex];
            if (!deleting) {
                charIndex++; el.textContent = phrase.slice(0, charIndex);
                if (charIndex === phrase.length) { deleting = true; setTimeout(tick, 1400); return; }
            } else {
                charIndex--; el.textContent = phrase.slice(0, charIndex);
                if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
            }
            setTimeout(tick, deleting ? 35 : 65);
        }
        tick();
    }

    /* ---------------- orbit tooltip ---------------- */
    function initOrbitTooltip() {
        const system = document.getElementById('orbit-system');
        const tooltip = document.getElementById('orbit-tooltip');
        if (!system || !tooltip) return;
        const nameEl = document.getElementById('orbit-tooltip-name');
        const levelEl = document.getElementById('orbit-tooltip-level');
        system.querySelectorAll('.orbit-node').forEach(node => {
            const inner = node.querySelector('.orbit-node-inner');
            inner.addEventListener('mouseenter', () => {
                nameEl.textContent = node.dataset.name;
                levelEl.textContent = node.dataset.level;
                tooltip.classList.add('show');
            });
            inner.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
        });
    }

    /* ---------------- HUD: clock, section label, scroll progress ---------------- */
    function initHud() {
        const clock = document.getElementById('hud-clock');
        function tickClock() {
            if (!clock) return;
            const now = new Date();
            const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            clock.textContent = fmt.format(now) + ' IST';
        }
        tickClock();
        setInterval(tickClock, 1000);

        const sections = document.querySelectorAll('main .section, .hero-section');
        const sectionLabel = document.getElementById('hud-section');
        const navLinks = document.querySelectorAll('.nav-rail-link');
        const fill = document.getElementById('scroll-fill');

        function onScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (fill) fill.style.width = Math.min((scrollTop / docHeight) * 100, 100) + '%';

            let current = sections[0];
            sections.forEach(sec => { if (scrollTop >= sec.offsetTop - window.innerHeight * 0.4) current = sec; });
            const id = current.id || 'hero';
            if (sectionLabel) sectionLabel.textContent = '§ ' + id.toUpperCase();
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------------- nav smooth scroll ---------------- */
    function initNav() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            });
        });
    }

    /* ---------------- project deck: drag-scroll + arrows ---------------- */
    function initProjectDeck() {
        const deck = document.getElementById('project-deck');
        const prevBtn = document.getElementById('deck-prev');
        const nextBtn = document.getElementById('deck-next');
        const progressFill = document.getElementById('deck-progress-fill');
        if (!deck) return;

        function cardWidth() {
            const card = deck.querySelector('.featured-card');
            return card ? card.getBoundingClientRect().width + 22 : 300;
        }
        prevBtn && prevBtn.addEventListener('click', () => deck.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
        nextBtn && nextBtn.addEventListener('click', () => deck.scrollBy({ left: cardWidth(), behavior: 'smooth' }));

        function updateProgress() {
            const max = deck.scrollWidth - deck.clientWidth;
            const pct = max > 0 ? (deck.scrollLeft / max) * 100 : 0;
            if (progressFill) progressFill.style.width = Math.max(pct, 8) + '%';
        }
        deck.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        let isDown = false, startX, scrollLeft;
        deck.addEventListener('mousedown', (e) => {
            isDown = true; deck.classList.add('dragging');
            startX = e.pageX - deck.offsetLeft; scrollLeft = deck.scrollLeft;
        });
        window.addEventListener('mouseup', () => { isDown = false; deck.classList.remove('dragging'); });
        deck.addEventListener('mouseleave', () => { isDown = false; deck.classList.remove('dragging'); });
        deck.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - deck.offsetLeft;
            deck.scrollLeft = scrollLeft - (x - startX) * 1.4;
        });
    }

    /* ---------------- notifications ---------------- */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<div class="notification-content"><i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${message}</span></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 50);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 350); }, 4500);
    }

    /* ---------------- contact form (mailto) ---------------- */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const submitBtn = form.querySelector('.btn-submit');
        function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
        function showFieldError(field, id) {
            field.classList.add('error');
            const err = document.getElementById(id);
            if (err) err.classList.add('show');
        }
        function clearFieldError(field, id) {
            field.classList.remove('error');
            const err = document.getElementById(id);
            if (err) err.classList.remove('show');
        }
        const name = form.querySelector('#name'), email = form.querySelector('#email'), message = form.querySelector('#message');
        [[name, 'name-error'], [email, 'email-error'], [message, 'message-error']].forEach(([field, errId]) => {
            field.addEventListener('input', () => clearFieldError(field, errId));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            clearFieldError(name, 'name-error'); clearFieldError(email, 'email-error'); clearFieldError(message, 'message-error');
            if (!name.value.trim()) { showFieldError(name, 'name-error'); valid = false; }
            if (!email.value.trim() || !isValidEmail(email.value.trim())) { showFieldError(email, 'email-error'); valid = false; }
            if (!message.value.trim()) { showFieldError(message, 'message-error'); valid = false; }
            if (!valid) return;

            submitBtn.disabled = true;
            const subject = encodeURIComponent(`Portfolio contact from ${name.value.trim()}`);
            const body = encodeURIComponent(`${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`);
            window.location.href = `mailto:rvpc792@gmail.com?subject=${subject}&body=${body}`;
            showNotification('Opening your email client…', 'success');
            setTimeout(() => { submitBtn.disabled = false; }, 1500);
        });
    }

    /* ---------------- GitHub live data ---------------- */
    const GITHUB_USERNAME = 'vsmm-world';
    const GITHUB_API_BASE = 'https://api.github.com';
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26',
        CSS: '#563d7c', Java: '#b07219', PHP: '#8993be', Kotlin: '#a97bff', EJS: '#ff2bd6',
        Dockerfile: '#384d54', Shell: '#89e051'
    };
    const GAUGE_CIRC = 2 * Math.PI * 52;

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.json();
    }

    function setGauge(id, rawValue, softCap) {
        const numEl = document.getElementById(id);
        if (!numEl) return;
        const target = Number(rawValue) || 0;
        const gauge = numEl.closest('.gauge');
        const fillCircle = gauge ? gauge.querySelector('.gauge-fill') : null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(numEl, target, '');
                    if (fillCircle) {
                        const ratio = Math.min(target / softCap, 1);
                        const offset = GAUGE_CIRC * (1 - ratio);
                        requestAnimationFrame(() => { fillCircle.style.strokeDashoffset = offset; });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        observer.observe(numEl);
    }

    function renderDonut(repos) {
        const svg = document.getElementById('donut-svg');
        const legend = document.getElementById('donut-legend');
        if (!svg || !legend) return;
        const counts = {};
        repos.forEach(r => { if (!r.fork && r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);

        if (!sorted.length) {
            legend.innerHTML = '<p style="color:var(--text-faint);font-size:0.8rem;">No language data available.</p>';
            return;
        }

        const r = 52, circ = 2 * Math.PI * r;
        let offsetAcc = 0;
        svg.innerHTML = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="14"/>`;
        sorted.forEach(([lang, count], i) => {
            const pct = count / total;
            const dash = pct * circ;
            const color = LANG_COLORS[lang] || `hsl(${(i * 57) % 360}, 70%, 60%)`;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', 60); circle.setAttribute('cy', 60); circle.setAttribute('r', r);
            circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', color);
            circle.setAttribute('stroke-width', 14);
            circle.setAttribute('stroke-dasharray', `${dash} ${circ - dash}`);
            circle.setAttribute('stroke-dashoffset', -offsetAcc);
            circle.style.transition = 'stroke-dasharray 1s ease';
            svg.appendChild(circle);
            offsetAcc += dash;
        });

        legend.innerHTML = sorted.map(([lang, count], i) => {
            const pct = ((count / total) * 100).toFixed(1);
            const color = LANG_COLORS[lang] || `hsl(${(i * 57) % 360}, 70%, 60%)`;
            return `<div class="donut-legend-row"><span class="donut-dot" style="background:${color}"></span><span class="donut-name">${lang}</span><span class="donut-pct">${pct}%</span></div>`;
        }).join('');
    }

    function escapeHTML(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

    function renderRepoTicker(repos) {
        const ticker = document.getElementById('repo-ticker');
        if (!ticker) return;
        const top = [...repos].sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at))).slice(0, 8);
        if (!top.length) { ticker.innerHTML = '<p style="color:var(--text-faint);font-size:0.8rem;">No repositories found.</p>'; return; }
        ticker.innerHTML = top.map(repo => `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-ticker-row magnetic">
                <span class="repo-ticker-name">${repo.name}</span>
                <span class="repo-ticker-stats"><i class="fas fa-star"></i> ${repo.stargazers_count} &nbsp; <i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </a>`).join('');
        initMagnetic();
    }

    async function initGitHubData() {
        try {
            const [profile, repos] = await Promise.all([
                fetchJSON(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`),
                fetchJSON(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
            ]);
            const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
            const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

            setGauge('gh-public-repos', profile.public_repos, 50);
            setGauge('gh-total-stars', totalStars, 50);
            setGauge('gh-followers', profile.followers, 30);
            setGauge('gh-total-forks', totalForks, 40);

            const repoStatEl = document.getElementById('stat-repos');
            if (repoStatEl) {
                const obs = new IntersectionObserver((entries) => {
                    entries.forEach(entry => { if (entry.isIntersecting) { animateCount(repoStatEl, profile.public_repos, '+'); obs.unobserve(entry.target); } });
                }, { threshold: 0.4 });
                obs.observe(repoStatEl);
            }

            renderDonut(repos);
            renderRepoTicker(repos);
        } catch (error) {
            console.error('GitHub data fetch failed:', error);
            const legend = document.getElementById('donut-legend');
            const ticker = document.getElementById('repo-ticker');
            const msg = `<div class="error-message"><i class="fas fa-exclamation-circle"></i><p>Couldn't reach the GitHub API (rate limit or network issue).</p><button onclick="location.reload()" class="btn-retry">Retry</button></div>`;
            if (legend) legend.innerHTML = msg;
            if (ticker) ticker.innerHTML = '';
        }
    }

    /* ---------------- footer ---------------- */
    function initFooter() {
        const updateEl = document.getElementById('update-date');
        if (updateEl) updateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const yearEl = document.getElementById('footer-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    /* ---------------- boot everything ---------------- */
    function boot() {
        initBootSequence();
        initParticleField();
        initCustomCursor();
        initTilt();
        initMagnetic();
        initScrollReveal();
        initCounters();
        initTypewriter();
        initOrbitTooltip();
        initHud();
        initNav();
        initProjectDeck();
        initContactForm();
        initFooter();
        initGitHubData();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
