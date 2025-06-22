// Smooth scrolling for navigation links with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.offsetTop;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function for smooth acceleration and deceleration
            const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            window.scrollTo(0, startPosition + distance * ease(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    });
});

// --- MOBILE MENU TOGGLE ---
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Enhanced scroll spy for navigation
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.pageYOffset + navHeight + 50;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Add your form submission logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            contactForm.reset();
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Initialize view counter
const viewCount = document.getElementById('view-count');
if (viewCount) {
    const count = localStorage.getItem('profileViews') || 0;
    localStorage.setItem('profileViews', Number(count) + 1);
    viewCount.textContent = Number(count) + 1;
}

// --- GITHUB DATA FETCH & RENDER ---
const GITHUB_USERNAME = 'vsmm-world';

async function fetchGitHubProfile() {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return null;
    return res.json();
}

async function fetchGitHubRepos() {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (!res.ok) return [];
    return res.json();
}

function renderGitHubProfile(profile) {
    const el = document.getElementById('github-profile-info');
    if (!el || !profile) return;
    el.innerHTML = `
        <div class="profile-card">
            <img src="${profile.avatar_url}" alt="${profile.name}" class="profile-avatar"/>
            <div class="profile-meta">
                <h3>${profile.name || profile.login}</h3>
                <p>${profile.bio || ''}</p>
                <div class="profile-stats">
                    <span><i class="fas fa-users"></i> ${profile.followers} followers</span>
                    <span><i class="fas fa-user-plus"></i> ${profile.following} following</span>
                    <span><i class="fas fa-book"></i> ${profile.public_repos} repos</span>
                </div>
                <a href="${profile.html_url}" target="_blank" class="btn btn-primary">View GitHub</a>
            </div>
        </div>
    `;
}

function renderGitHubRepos(repos) {
    const grid = document.getElementById('github-projects');
    if (!grid) return;
    if (!repos.length) {
        grid.innerHTML = '<div class="error-message">No repositories found.</div>';
        return;
    }
    grid.innerHTML = repos.slice(0, 8).map(repo => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${repo.name}</h3>
                <span class="project-date">${new Date(repo.updated_at).getFullYear()}</span>
            </div>
            <div class="project-description">${repo.description || ''}</div>
            <div class="project-tech-stack">
                ${repo.language ? `<span class="tech-badge">${repo.language}</span>` : ''}
            </div>
            <div class="project-stats">
                <span class="stat-item"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span class="stat-item"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="btn btn-secondary">View Repo</a>
            </div>
        </div>
    `).join('');
}

async function initGitHub() {
    const [profile, repos] = await Promise.all([
        fetchGitHubProfile(),
        fetchGitHubRepos()
    ]);
    renderGitHubProfile(profile);
    renderGitHubRepos(repos);
}

document.addEventListener('DOMContentLoaded', () => {
    initGitHub();
});