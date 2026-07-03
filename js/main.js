/* ============================================================
   RAVINDRA VALAND — SCI-FI PORTFOLIO
   Particle background, custom cursor, tilt/magnetic interactions,
   scroll reveals, count-up stats, typewriter, live GitHub data.
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
            '> booting portfolio.exe',
            '> loading modules ......... [OK]',
            '> establishing uplink ...... [OK]',
            '> rendering interface ...... [OK]',
            '> welcome, visitor.'
        ];

        if (prefersReducedMotion) {
            el.textContent = lines.join('\n');
            setTimeout(() => hidePreloader(preloader), 400);
            return;
        }

        let lineIndex = 0, charIndex = 0;
        let out = '';

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
                setTimeout(typeNext, 120);
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
        const density = prefersReducedMotion ? 0 : (isSmall ? 45 : 90);

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        function makeParticles() {
            particles = Array.from({ length: density }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.6
            }));
        }
        resize();
        makeParticles();
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

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 242, 0.55)';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 118) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.18 * (1 - dist / 118)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        }
        if (!prefersReducedMotion) requestAnimationFrame(tick);
    }

    /* ---------------- custom cursor ---------------- */
    function initCustomCursor() {
        if (!hasFinePointer) return;
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });

        function raf() {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        document.querySelectorAll('a, button, .tilt, .magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('active'));
            el.addEventListener('mouseleave', () => ring.classList.remove('active'));
        });
    }

    /* ---------------- 3D tilt cards ---------------- */
    function initTilt() {
        if (!hasFinePointer || prefersReducedMotion) return;
        document.querySelectorAll('.tilt').forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    /* ---------------- magnetic buttons ---------------- */
    function initMagnetic() {
        if (!hasFinePointer || prefersReducedMotion) return;
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
        });
    }

    /* ---------------- scroll reveal ---------------- */
    function initScrollReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;
        if (prefersReducedMotion) {
            items.forEach(el => el.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        items.forEach(el => observer.observe(el));
    }

    /* ---------------- skill bars ---------------- */
    function initSkillBars() {
        const bars = document.querySelectorAll('.progress-bar');
        if (!bars.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.dataset.width + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.4 });
        bars.forEach(bar => observer.observe(bar));
    }

    /* ---------------- count-up stats ---------------- */
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
                    const target = parseInt(el.dataset.count, 10);
                    animateCount(el, target, el.dataset.suffix || '');
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
        const phrases = [
            'Full Stack Developer',
            'NestJS & Node.js Backend',
            'React Frontend Engineer',
            'Freelance / 3 Years Experience'
        ];
        if (prefersReducedMotion) { el.textContent = phrases[0]; return; }

        let phraseIndex = 0, charIndex = 0, deleting = false;
        function tick() {
            const phrase = phrases[phraseIndex];
            if (!deleting) {
                charIndex++;
                el.textContent = phrase.slice(0, charIndex);
                if (charIndex === phrase.length) {
                    deleting = true;
                    setTimeout(tick, 1400);
                    return;
                }
            } else {
                charIndex--;
                el.textContent = phrase.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            }
            setTimeout(tick, deleting ? 35 : 65);
        }
        tick();
    }

    /* ---------------- nav ---------------- */
    function initNav() {
        const header = document.getElementById('site-header');
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        });

        if (toggle && menu) {
            toggle.addEventListener('click', () => menu.classList.toggle('active'));
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => menu.classList.remove('active'));
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            });
        });
    }

    /* ---------------- scroll progress ---------------- */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        bar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(bar);
        const fill = bar.querySelector('.scroll-progress-fill');
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            fill.style.width = Math.min(scrolled, 100) + '%';
        });
    }

    /* ---------------- notifications ---------------- */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<div class="notification-content"><i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${message}</span></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 50);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 350);
        }, 4500);
    }

    /* ---------------- contact form (mailto, no backend) ---------------- */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const submitBtn = form.querySelector('.btn-submit');

        function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

        function showFieldError(field, message) {
            field.classList.add('error');
            const err = field.parentNode.querySelector('.form-error');
            if (err) { err.textContent = message; err.classList.add('show'); }
        }
        function clearFieldError(field) {
            field.classList.remove('error');
            const err = field.parentNode.querySelector('.form-error');
            if (err) err.classList.remove('show');
        }

        form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('input', () => clearFieldError(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            let valid = true;

            [name, email, message].forEach(clearFieldError);

            if (!name.value.trim()) { showFieldError(name, 'Please enter your name'); valid = false; }
            if (!email.value.trim() || !isValidEmail(email.value.trim())) { showFieldError(email, 'Please enter a valid email address'); valid = false; }
            if (!message.value.trim()) { showFieldError(message, 'Please enter your message'); valid = false; }
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
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
        HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', PHP: '#4F5D95',
        Kotlin: '#A97BFF', EJS: '#a91e50', Dockerfile: '#384d54', Shell: '#89e051'
    };

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.json();
    }

    function setStat(id, value, suffix) {
        const el = document.getElementById(id);
        if (!el) return;
        const target = Number(value) || 0;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(el, target, suffix || '');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        observer.observe(el);
    }

    function renderLanguages(repos) {
        const container = document.getElementById('gh-languages');
        if (!container) return;
        const counts = {};
        repos.forEach(r => {
            if (r.fork) return;
            if (!r.language) return;
            counts[r.language] = (counts[r.language] || 0) + 1;
        });
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);

        if (!sorted.length) {
            container.innerHTML = '<p class="section-subtitle" style="margin:0;">No language data available.</p>';
            return;
        }

        container.innerHTML = sorted.map(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const color = LANG_COLORS[lang] || '#8b93ac';
            return `
                <div class="gh-lang-row">
                    <span class="gh-lang-name">${lang}</span>
                    <span class="gh-lang-bar-track"><span class="gh-lang-bar-fill" style="background:${color}" data-width="${pct}"></span></span>
                    <span class="gh-lang-pct">${pct}%</span>
                </div>`;
        }).join('');

        requestAnimationFrame(() => {
            container.querySelectorAll('.gh-lang-bar-fill').forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
            });
        });
    }

    function renderTopRepoCards(repos) {
        const grid = document.getElementById('github-projects');
        if (!grid) return;
        const top = [...repos]
            .filter(r => !r.fork || r.stargazers_count > 0)
            .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
            .slice(0, 6);

        if (!top.length) { grid.innerHTML = '<p class="section-subtitle">No repositories found.</p>'; return; }

        grid.innerHTML = top.map(repo => `
            <div class="project-card tilt">
                <div class="project-header">
                    <h3 class="project-title">${repo.name}</h3>
                    <span class="project-meta">${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
                <p class="project-description">${repo.description ? escapeHTML(repo.description) : 'No description available.'}</p>
                <div class="project-stats">
                    <span class="stat-item"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="stat-item"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span class="stat-item"><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm magnetic">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        `).join('');

        initTilt();
        initMagnetic();
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    async function initGitHubData() {
        const grid = document.getElementById('github-projects');
        const langBox = document.getElementById('gh-languages');
        try {
            const [profile, repos] = await Promise.all([
                fetchJSON(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`),
                fetchJSON(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
            ]);

            const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
            const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

            setStat('gh-public-repos', profile.public_repos);
            setStat('gh-total-stars', totalStars);
            setStat('gh-followers', profile.followers);
            setStat('gh-total-forks', totalForks);
            setStat('stat-repos', profile.public_repos, '+');

            renderLanguages(repos);
            renderTopRepoCards(repos);
        } catch (error) {
            console.error('GitHub data fetch failed:', error);
            if (grid) {
                grid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Couldn't reach the GitHub API right now (rate limit or network issue).</p>
                        <button onclick="location.reload()" class="btn-retry">Retry</button>
                    </div>`;
            }
            if (langBox) langBox.innerHTML = '<p class="section-subtitle" style="margin:0;">Unavailable right now.</p>';
        }
    }

    /* ---------------- footer ---------------- */
    function initFooter() {
        const yearEl = document.getElementById('footer-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
        const updateEl = document.getElementById('update-date');
        if (updateEl) {
            updateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }

    /* ---------------- boot everything ---------------- */
    function boot() {
        initBootSequence();
        initParticleField();
        initCustomCursor();
        initTilt();
        initMagnetic();
        initScrollReveal();
        initSkillBars();
        initCounters();
        initTypewriter();
        initNav();
        initScrollProgress();
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
