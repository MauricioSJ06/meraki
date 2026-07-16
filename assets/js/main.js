/**
 * Meraki Dental Care Coyoacán - Main JavaScript Controller
 * Handles Navigation, Mobile Drawer, Scroll Reveals, FAQ Accordions, and Testimonials Carousel.
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyNavbar();
    initMobileDrawer();
    initScrollReveal();
    initSmoothScrolling();
    initFAQAccordion();
    initTestimonialsCarousel();
});

/**
 * 1. Sticky Navbar & Scroll Shadow/Background Controller
 */
function initStickyNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const updateNavbar = () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg', 'bg-surface/95');
            nav.classList.remove('bg-surface/80');
        } else {
            nav.classList.remove('shadow-lg', 'bg-surface/95');
            nav.classList.add('bg-surface/80');
        }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

/**
 * 2. Mobile Navigation Drawer Controller
 */
function initMobileDrawer() {
    const openBtn = document.getElementById('open-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawerLinks = drawer ? drawer.querySelectorAll('a[href^="#"]') : [];

    if (!openBtn || !drawer || !overlay) return;

    const openMenu = () => {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        openBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        openBtn.setAttribute('aria-expanded', 'false');
    };

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // Close when clicking any link inside drawer
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * 3. Scroll Reveal Animations with IntersectionObserver
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 4. Smooth Scrolling with Offset for Sticky Navbar
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    const navHeight = 84; // Sticky nav offset

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * 5. FAQ Accordion Smooth Management
 */
function initFAQAccordion() {
    const detailsElements = document.querySelectorAll('section#faq details, details.faq-item');

    detailsElements.forEach((targetDetail) => {
        const summary = targetDetail.querySelector('summary');
        if (!summary) return;

        summary.addEventListener('click', (e) => {
            // Optional: Close other open accordions for clean single-open feel
            detailsElements.forEach((detail) => {
                if (detail !== targetDetail && detail.hasAttribute('open')) {
                    detail.removeAttribute('open');
                }
            });
        });
    });
}

/**
 * 6. Testimonials Carousel Controller (Mobile Responsive + Auto Rotate)
 */
function initTestimonialsCarousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonials-dots');
    if (cards.length === 0 || !dotsContainer) return;

    let currentIndex = 0;
    let autoPlayInterval = null;

    // Create dots
    cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ver testimonio ${idx + 1}`);
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    const updateResponsiveDisplay = () => {
        if (window.innerWidth >= 768) {
            // Desktop: Show all cards in grid
            cards.forEach(card => card.style.display = 'block');
            dotsContainer.style.display = 'none';
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        } else {
            // Mobile: Show only active card
            dotsContainer.style.display = 'flex';
            showSlide(currentIndex);
            startAutoPlay();
        }
    };

    const showSlide = (index) => {
        if (window.innerWidth >= 768) return;
        currentIndex = index;
        cards.forEach((card, idx) => {
            card.style.display = idx === index ? 'block' : 'none';
        });
        dots.forEach((dot, idx) => {
            if (idx === index) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    const nextSlide = () => {
        showSlide((currentIndex + 1) % cards.length);
    };

    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
        if (window.innerWidth < 768) {
            startAutoPlay();
        }
    };

    window.addEventListener('resize', updateResponsiveDisplay, { passive: true });
    updateResponsiveDisplay();
}
