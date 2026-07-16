// Navigation scroll effect
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for styling
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for anchor links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed nav
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
const animatedElements = document.querySelectorAll('.service-card, .stat, .advantage-item, .gallery-item');
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    animateOnScroll.observe(el);
});

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero image
const heroImage = document.querySelector('.hero-image img');
if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset;
        if (scrollPos < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrollPos * 0.3}px)`;
        }
    });
}

// Service cards hover effect enhancement
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
        card.style.willChange = 'auto';
    });
});

// Gallery item click handler for potential lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || '';
        const tag = item.querySelector('.gallery-tag')?.textContent || '';
        
        // Could implement a lightbox here
        console.log('Gallery item clicked:', { src: img.src, title, tag });
    });
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    };
    
    updateCounter();
};

// Observe stats for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target.querySelector('.stat-number');
            if (numberEl && !numberEl.classList.contains('animated')) {
                numberEl.classList.add('animated');
                const text = numberEl.textContent;
                const value = parseInt(text.replace(/[^0-9]/g, ''));
                if (value) {
                    animateCounter(numberEl, value);
                }
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statObserver.observe(stat);
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = [
        document.querySelector('.hero-image img'),
        document.querySelector('.about-image img')
    ];
    
    criticalImages.forEach(img => {
        if (img && img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.src;
            document.head.appendChild(preloadLink);
        }
    });
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.service-card, .stat, .advantage-item, .gallery-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
    });
}

console.log('Lancaster Landscape - Site initialized');
