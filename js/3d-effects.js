/**
 * 3D Effects and Animations using Three.js
 * Lightweight and performant 3D visual effects
 */

// Initialize Three.js Scene
let scene, camera, renderer, particles, animationId;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Performance flag
let isAnimating = true;

/**
 * Initialize 3D Particle Background
 */
function init3DBackground() {
    const container = document.getElementById('hero-3d-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        1,
        1000
    );
    camera.position.z = 500;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
    container.appendChild(renderer.domElement);

    // Create particles
    createParticleSystem();

    // Add floating 3D shapes
    createFloating3DShapes();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate3D();
}

/**
 * Create Particle System
 */
function createParticleSystem() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        positions[i] = Math.random() * 2000 - 1000;
        positions[i + 1] = Math.random() * 2000 - 1000;
        positions[i + 2] = Math.random() * 2000 - 1000;
        
        // Color gradient (purple to blue)
        const mixRatio = Math.random();
        color.setRGB(
            0.4 + mixRatio * 0.3,
            0.3 + mixRatio * 0.4,
            0.9
        );
        
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

/**
 * Create Floating 3D Shapes
 */
function createFloating3DShapes() {
    // Create wireframe geometries
    const geometries = [
        new THREE.IcosahedronGeometry(80, 0),
        new THREE.OctahedronGeometry(70, 0),
        new THREE.TetrahedronGeometry(60, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    geometries.forEach((geometry, index) => {
        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.x = (index - 1) * 300;
        mesh.position.y = Math.random() * 200 - 100;
        mesh.position.z = -200;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            }
        };
        scene.add(mesh);
    });
}

/**
 * Animation Loop
 */
function animate3D() {
    if (!isAnimating) return;
    
    animationId = requestAnimationFrame(animate3D);
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
    }
    
    // Animate floating shapes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
        }
    });
    
    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.01;
    camera.position.y += (-mouseY - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

/**
 * Mouse Move Handler
 */
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

/**
 * Window Resize Handler
 */
function onWindowResize() {
    const container = document.getElementById('hero-3d-canvas');
    if (!container) return;
    
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Cleanup function
 */
function cleanup3D() {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
}

/**
 * Initialize 3D Card Effects for Skills Section
 */
function init3DCardEffects() {
    const cards = document.querySelectorAll('.skill-card, .project-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

/**
 * 3D Parallax Scroll Effect
 */
function init3DParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

/**
 * Intersection Observer for Performance
 */
function init3DIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-3d');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize all 3D effects
 */
function initAll3DEffects() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D background');
    } else {
        init3DBackground();
    }
    
    // Initialize card effects (no Three.js required)
    init3DCardEffects();
    
    // Initialize parallax
    init3DParallax();
    
    // Initialize intersection observer
    init3DIntersectionObserver();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll3DEffects);
} else {
    initAll3DEffects();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup3D);
