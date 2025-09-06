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
    const navbar = document.querySelector('.site-header');
    const navHeight = navbar ? navbar.offsetHeight : 80;
    const scrollPosition = window.pageYOffset + navHeight + 50;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
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
// Use GITHUB_USERNAME from global scope
async function fetchGitHubProfile() {
    const GITHUB_USERNAME = window.GITHUB_USERNAME || 'vsmm-world';
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return null;
    return res.json();
}

async function fetchGitHubRepos() {
    const GITHUB_USERNAME = window.GITHUB_USERNAME || 'vsmm-world';
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
    initThemeToggle();
    initEnhancedAnimations();
    initHeaderScrollEffect();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon(themeIcon, savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(themeIcon, isDark);
    });
}

function updateThemeIcon(icon, isDark) {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Enhanced Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for style changes
        header.classList.toggle('scrolled', scrollTop > 50);
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });
}

// Enhanced Animations
function initEnhancedAnimations() {
    // Parallax effect for hero shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroShapes = document.querySelectorAll('.shape');
        
        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Parallax for tech icons
        const techIcons = document.querySelectorAll('.tech-icon');
        techIcons.forEach((icon, index) => {
            const speed = 0.3 + (index * 0.05);
            icon.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Intersection Observer for smooth section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Enhanced skill card hover effects
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate progress bars when skills section comes into view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}