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
            const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
            
            window.scrollTo(0, startPosition + distance * ease(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    });
});

// Enhanced scroll spy for navigation
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.pageYOffset + navHeight + 50; // Added offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // More precise calculation of current section
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
            
            // Add a visual indicator for scroll progress
            const progress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
            section.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
        }
    });

    // Update navigation links with smooth transition
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            // Add subtle animation for active link
            link.style.transform = 'scale(1.1)';
            setTimeout(() => link.style.transform = 'scale(1)', 200);
        }
    });
});

// Add scroll to top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '↑';
scrollButton.className = 'scroll-top-btn';
scrollButton.style.display = 'none';
document.body.appendChild(scrollButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});