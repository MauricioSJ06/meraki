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
    initBookingWizard();
    initAdminPanel();
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

/* ==========================================================================
   7. SHARED STORAGE & HELPERS FOR APPOINTMENTS (LOCALSTORAGE)
   ========================================================================== */
const STORAGE_KEY = 'meraki_citas';

function getAppointments() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading meraki_citas from localStorage:', e);
        return [];
    }
}

function saveAppointments(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        console.error('Error saving meraki_citas to localStorage:', e);
    }
}

function formatDateReadable(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    return `${days[date.getDay()]}, ${day} de ${months[month]} de ${year}`;
}

/* ==========================================================================
   8. BOOKING WIZARD CONTROLLER (agendar.html)
   ========================================================================== */
function initBookingWizard() {
    const wizardContainer = document.getElementById('wizard-container');
    if (!wizardContainer) return;

    let currentStep = 1;
    let bookingData = {
        id: '',
        serviceId: '',
        serviceName: '',
        duration: '',
        price: '',
        dateStr: '',
        timeStr: '',
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        firstVisit: 'yes',
        notes: '',
        policy: false,
        status: 'confirmada',
        createdAt: ''
    };

    let calendarCurrentDate = new Date(); // Start at current month
    // If we are before July 2026, or whatever, we can navigate freely or start at today

    const stepIndicators = document.querySelectorAll('.wizard-step-indicator');
    const mobileStepNumber = document.getElementById('mobile-step-number');
    const mobileStepLabel = document.getElementById('mobile-step-label');
    const mobileStepTitle = document.getElementById('mobile-step-title');
    const stepTitles = ['Seleccionar Servicio', 'Fecha y Hora', 'Datos del Paciente', 'Confirmación'];

    function showStep(step) {
        currentStep = step;
        document.querySelectorAll('.wizard-step').forEach((el, idx) => {
            if (idx + 1 === step) {
                el.classList.remove('hidden');
                el.classList.add('block');
            } else {
                el.classList.add('hidden');
                el.classList.remove('block');
            }
        });

        stepIndicators.forEach((el) => {
            const elStep = parseInt(el.getAttribute('data-step') || '0', 10);
            if (elStep === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        if (mobileStepNumber) mobileStepNumber.textContent = step;
        if (mobileStepLabel) mobileStepLabel.textContent = `Paso ${step} de 4`;
        if (mobileStepTitle) mobileStepTitle.textContent = stepTitles[step - 1] || '';

        window.scrollTo({ top: wizardContainer.offsetTop - 120, behavior: 'smooth' });
    }

    // Step 1: Service Selection
    const serviceCards = document.querySelectorAll('.service-card');
    const btnStep1Next = document.getElementById('btn-step-1-next');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            bookingData.serviceId = card.getAttribute('data-service-id');
            bookingData.serviceName = card.getAttribute('data-service-name');
            bookingData.duration = card.getAttribute('data-service-duration');
            bookingData.price = card.getAttribute('data-service-price');

            if (btnStep1Next) btnStep1Next.disabled = false;
        });
    });

    if (btnStep1Next) {
        btnStep1Next.addEventListener('click', () => {
            if (!bookingData.serviceName) return;
            const badgeService = document.getElementById('badge-selected-service');
            const badgeDuration = document.getElementById('badge-selected-duration');
            const summaryService = document.getElementById('summary-service');
            if (badgeService) badgeService.textContent = bookingData.serviceName;
            if (badgeDuration) badgeDuration.textContent = bookingData.duration;
            if (summaryService) summaryService.textContent = bookingData.serviceName;

            renderCalendar();
            showStep(2);
        });
    }

    // Step 2: Calendar & Time Slots
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('calendar-prev-btn');
    const nextMonthBtn = document.getElementById('calendar-next-btn');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const slotsPlaceholder = document.getElementById('slots-placeholder');
    const btnStep2Prev = document.getElementById('btn-step-2-prev');
    const btnStep2Next = document.getElementById('btn-step-2-next');

    const standardSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'];

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    function renderCalendar() {
        if (!calendarDays || !calendarMonthYear) return;
        calendarDays.innerHTML = '';

        const year = calendarCurrentDate.getFullYear();
        const month = calendarCurrentDate.getMonth();

        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allAppointments = getAppointments();

        // Padding empty cells for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'py-2';
            calendarDays.appendChild(emptyDiv);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPast = dateObj < today;
            const isSunday = dateObj.getDay() === 0;
            const isToday = dateObj.getTime() === today.getTime();

            // Count busy slots for this day from appointments
            const busyAppointments = allAppointments.filter(a => a.dateStr === dateStr && a.status !== 'cancelada');
            const busyCount = busyAppointments.length;
            const isFull = busyCount >= standardSlots.length;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'calendar-day-btn';
            if (isToday) btn.classList.add('today');
            if (dateStr === bookingData.dateStr) btn.classList.add('selected');

            btn.innerHTML = `<span>${day}</span>`;

            if (isPast || isSunday || isFull) {
                btn.classList.add('disabled');
                btn.disabled = true;
                if (isSunday) btn.title = 'Domingo cerrado';
                if (isFull) {
                    btn.innerHTML += `<span class="busy-badge">Lleno</span>`;
                }
            } else {
                if (busyCount >= 4) {
                    btn.innerHTML += `<span class="busy-badge">Ocupado</span>`;
                }
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    bookingData.dateStr = dateStr;
                    bookingData.timeStr = '';
                    if (btnStep2Next) btnStep2Next.disabled = true;
                    renderTimeSlots(dateStr);
                });
            }

            calendarDays.appendChild(btn);
        }
    }

    function renderTimeSlots(dateStr) {
        if (!timeSlotsGrid || !slotsPlaceholder) return;
        slotsPlaceholder.classList.add('hidden');
        timeSlotsGrid.classList.remove('hidden');
        timeSlotsGrid.innerHTML = '';

        const allAppointments = getAppointments();
        const busyOnThisDate = allAppointments.filter(a => a.dateStr === dateStr && a.status !== 'cancelada');
        const busyTimes = busyOnThisDate.map(a => a.timeStr);

        standardSlots.forEach(slot => {
            const isBusy = busyTimes.includes(slot);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `time-slot-btn ${isBusy ? 'busy' : ''}`;
            btn.textContent = slot;

            if (isBusy) {
                btn.disabled = true;
                btn.title = 'Horario reservado';
            } else {
                if (bookingData.timeStr === slot) btn.classList.add('selected');
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    bookingData.timeStr = slot;
                    if (btnStep2Next) btnStep2Next.disabled = false;
                });
            }

            timeSlotsGrid.appendChild(btn);
        });
    }

    if (btnStep2Prev) {
        btnStep2Prev.addEventListener('click', () => {
            showStep(1);
        });
    }

    if (btnStep2Next) {
        btnStep2Next.addEventListener('click', () => {
            if (!bookingData.dateStr || !bookingData.timeStr) return;
            const summaryDatetime = document.getElementById('summary-datetime');
            if (summaryDatetime) {
                summaryDatetime.textContent = `${formatDateReadable(bookingData.dateStr)} a las ${bookingData.timeStr} hrs`;
            }
            showStep(3);
        });
    }

    // Step 3: Patient Form
    const btnStep3Prev = document.getElementById('btn-step-3-prev');
    const btnStep3Submit = document.getElementById('btn-step-3-submit');
    const form = document.getElementById('booking-form');

    if (btnStep3Prev) {
        btnStep3Prev.addEventListener('click', () => {
            showStep(2);
        });
    }

    if (btnStep3Submit && form) {
        btnStep3Submit.addEventListener('click', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('patient-name');
            const phoneInput = document.getElementById('patient-phone');
            const emailInput = document.getElementById('patient-email');
            const notesInput = document.getElementById('patient-notes');
            const policyInput = document.getElementById('patient-policy');

            const errorName = document.getElementById('error-name');
            const errorPhone = document.getElementById('error-phone');
            const errorEmail = document.getElementById('error-email');
            const errorPolicy = document.getElementById('error-policy');

            // Reset errors
            if (errorName) errorName.classList.add('hidden');
            if (errorPhone) errorPhone.classList.add('hidden');
            if (errorEmail) errorEmail.classList.add('hidden');
            if (errorPolicy) errorPolicy.classList.add('hidden');

            let isValid = true;

            if (!nameInput.value || nameInput.value.trim().length < 3) {
                if (errorName) errorName.classList.remove('hidden');
                isValid = false;
            }

            const phoneClean = phoneInput.value.replace(/\D/g, '');
            if (phoneClean.length !== 10) {
                if (errorPhone) errorPhone.classList.remove('hidden');
                isValid = false;
            }

            if (emailInput.value && !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                if (errorEmail) errorEmail.classList.remove('hidden');
                isValid = false;
            }

            if (!policyInput.checked) {
                if (errorPolicy) errorPolicy.classList.remove('hidden');
                isValid = false;
            }

            if (!isValid) return;

            // Fill data & save
            const firstVisitRadio = document.querySelector('input[name="first-visit"]:checked');
            bookingData.patientName = nameInput.value.trim();
            bookingData.patientPhone = phoneClean;
            bookingData.patientEmail = emailInput.value ? emailInput.value.trim() : '';
            bookingData.firstVisit = firstVisitRadio ? firstVisitRadio.value : 'yes';
            bookingData.notes = notesInput.value ? notesInput.value.trim() : '';
            bookingData.policy = true;
            bookingData.status = 'confirmada';
            bookingData.createdAt = new Date().toISOString();

            const list = getAppointments();
            const folioNumber = 1000 + list.length + Math.floor(Math.random() * 50);
            bookingData.id = `MK-${folioNumber}`;

            list.push(bookingData);
            saveAppointments(list);

            // Populate ticket in Step 4
            document.getElementById('ticket-id').textContent = `#${bookingData.id}`;
            document.getElementById('ticket-service').textContent = bookingData.serviceName;
            document.getElementById('ticket-date').textContent = formatDateReadable(bookingData.dateStr);
            document.getElementById('ticket-time').textContent = `${bookingData.timeStr} hrs`;
            document.getElementById('ticket-patient').textContent = bookingData.patientName;
            document.getElementById('ticket-phone').textContent = bookingData.patientPhone;

            const waText = encodeURIComponent(
                `Hola Meraki Dental! Acabo de agendar la cita #${bookingData.id} para ${bookingData.serviceName} el ${formatDateReadable(bookingData.dateStr)} a las ${bookingData.timeStr} hrs. Mi nombre es ${bookingData.patientName}.`
            );
            const btnWaConfirm = document.getElementById('btn-whatsapp-confirm');
            if (btnWaConfirm) {
                btnWaConfirm.href = `https://wa.me/525622637829?text=${waText}`;
            }

            showStep(4);
        });
    }

    // Step 4: Restart wizard
    const btnRestart = document.getElementById('btn-restart-wizard');
    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            bookingData = {
                id: '',
                serviceId: '',
                serviceName: '',
                duration: '',
                price: '',
                dateStr: '',
                timeStr: '',
                patientName: '',
                patientPhone: '',
                patientEmail: '',
                firstVisit: 'yes',
                notes: '',
                policy: false,
                status: 'confirmada',
                createdAt: ''
            };
            if (form) form.reset();
            if (btnStep1Next) btnStep1Next.disabled = true;
            if (btnStep2Next) btnStep2Next.disabled = true;
            document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
            showStep(1);
        });
    }
}

/* ==========================================================================
   9. ADMIN PANEL CONTROLLER (admin.html)
   ========================================================================== */
function initAdminPanel() {
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    if (!loginScreen || !adminDashboard) return;

    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const userBadge = document.getElementById('admin-user-badge');
    const btnLogout = document.getElementById('btn-admin-logout');

    let currentFilter = 'all';
    let currentView = 'list'; // 'list' | 'calendar'
    let currentCalendarWeekStart = new Date();

    // Adjust week start to Monday
    const day = currentCalendarWeekStart.getDay();
    const diff = currentCalendarWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentCalendarWeekStart = new Date(currentCalendarWeekStart.setDate(diff));
    currentCalendarWeekStart.setHours(0, 0, 0, 0);

    // Auth Check
    const checkAuth = () => {
        const isAuth = sessionStorage.getItem('meraki_admin_auth') === 'true';
        if (isAuth) {
            loginScreen.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            if (userBadge) {
                userBadge.classList.remove('hidden');
                userBadge.classList.add('flex');
            }
            renderDashboard();
        } else {
            loginScreen.classList.remove('hidden');
            adminDashboard.classList.add('hidden');
            if (userBadge) {
                userBadge.classList.add('hidden');
                userBadge.classList.remove('flex');
            }
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (passwordInput && passwordInput.value === 'meraki2026') {
                if (loginError) loginError.classList.add('hidden');
                sessionStorage.setItem('meraki_admin_auth', 'true');
                checkAuth();
            } else {
                if (loginError) loginError.classList.remove('hidden');
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('meraki_admin_auth');
            checkAuth();
        });
    }

    // Tabs navigation
    const tabListBtn = document.getElementById('tab-list-btn');
    const tabCalendarBtn = document.getElementById('tab-calendar-btn');
    const viewList = document.getElementById('view-list');
    const viewCalendar = document.getElementById('view-calendar');

    if (tabListBtn && tabCalendarBtn) {
        tabListBtn.addEventListener('click', () => {
            currentView = 'list';
            tabListBtn.className = 'flex-1 md:flex-none px-6 py-2.5 rounded-md font-label-md uppercase tracking-wider text-xs bg-primary text-white shadow-sm transition-all flex items-center justify-center gap-2';
            tabCalendarBtn.className = 'flex-1 md:flex-none px-6 py-2.5 rounded-md font-label-md uppercase tracking-wider text-xs text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-2';
            if (viewList) viewList.classList.remove('hidden');
            if (viewCalendar) viewCalendar.classList.add('hidden');
            renderDashboard();
        });

        tabCalendarBtn.addEventListener('click', () => {
            currentView = 'calendar';
            tabCalendarBtn.className = 'flex-1 md:flex-none px-6 py-2.5 rounded-md font-label-md uppercase tracking-wider text-xs bg-primary text-white shadow-sm transition-all flex items-center justify-center gap-2';
            tabListBtn.className = 'flex-1 md:flex-none px-6 py-2.5 rounded-md font-label-md uppercase tracking-wider text-xs text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-2';
            if (viewCalendar) viewCalendar.classList.remove('hidden');
            if (viewList) viewList.classList.add('hidden');
            renderDashboard();
        });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderDashboard();
        });
    });

    // Demo Data Generation
    const btnGenerateDemo = document.getElementById('btn-generate-demo');
    if (btnGenerateDemo) {
        btnGenerateDemo.addEventListener('click', () => {
            const today = new Date();
            const getDayStr = (offsetDays) => {
                const d = new Date(today);
                d.setDate(today.getDate() + offsetDays);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            };

            const demoData = [
                {
                    id: 'MK-1001',
                    serviceId: 'estetica-dental',
                    serviceName: 'Estética Dental',
                    duration: '45 min',
                    price: '3500',
                    dateStr: getDayStr(0),
                    timeStr: '10:00',
                    patientName: 'Mariana Sánchez',
                    patientPhone: '5512345678',
                    patientEmail: 'mariana.s@ejemplo.com',
                    firstVisit: 'yes',
                    notes: 'Interesada en carillas de porcelana.',
                    policy: true,
                    status: 'confirmada',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MK-1002',
                    serviceId: 'odontologia-general',
                    serviceName: 'Odontología General',
                    duration: '30 min',
                    price: '800',
                    dateStr: getDayStr(0),
                    timeStr: '12:00',
                    patientName: 'Carlos Rivera',
                    patientPhone: '5587654321',
                    patientEmail: 'carlos.r@ejemplo.com',
                    firstVisit: 'no',
                    notes: 'Revisión periódica y sensibilidad en muela posterior.',
                    policy: true,
                    status: 'completada',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MK-1003',
                    serviceId: 'limpieza-profunda',
                    serviceName: 'Limpieza Profunda',
                    duration: '45 min',
                    price: '800',
                    dateStr: getDayStr(0),
                    timeStr: '16:00',
                    patientName: 'Fernanda Gómez',
                    patientPhone: '5543218765',
                    patientEmail: 'fer.gomez@ejemplo.com',
                    firstVisit: 'yes',
                    notes: 'Primera limpieza en 2 años, solicita anestesia tópica si es posible.',
                    policy: true,
                    status: 'confirmada',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MK-1004',
                    serviceId: 'ortodoncia',
                    serviceName: 'Ortodoncia (Valoración)',
                    duration: '30 min',
                    price: '1000',
                    dateStr: getDayStr(1),
                    timeStr: '11:00',
                    patientName: 'Roberto Díaz',
                    patientPhone: '5599887766',
                    patientEmail: 'roberto.d@ejemplo.com',
                    firstVisit: 'yes',
                    notes: 'Desea información sobre alineadores invisibles (Invisalign).',
                    policy: true,
                    status: 'confirmada',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MK-1005',
                    serviceId: 'endodoncia',
                    serviceName: 'Endodoncia',
                    duration: '60 min',
                    price: '1500',
                    dateStr: getDayStr(2),
                    timeStr: '17:00',
                    patientName: 'Claudia Garza',
                    patientPhone: '5511223344',
                    patientEmail: 'claudia.g@ejemplo.com',
                    firstVisit: 'no',
                    notes: 'Dolor agudo al masticar en pieza inferior.',
                    policy: true,
                    status: 'confirmada',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MK-1006',
                    serviceId: 'implantes',
                    serviceName: 'Implantes (Valoración)',
                    duration: '30 min',
                    price: '2000',
                    dateStr: getDayStr(-1),
                    timeStr: '13:00',
                    patientName: 'Hugo Martínez',
                    patientPhone: '5566778899',
                    patientEmail: 'hugo.m@ejemplo.com',
                    firstVisit: 'no',
                    notes: 'Seguimiento de cirugía previa.',
                    policy: true,
                    status: 'cancelada',
                    createdAt: new Date().toISOString()
                }
            ];

            const existing = getAppointments();
            const combined = [...demoData, ...existing];
            // Remove duplicates by ID
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            saveAppointments(unique);
            renderDashboard();
            alert('¡Se han generado citas de prueba exitosamente!');
        });
    }

    // Export CSV
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => {
            const list = getAppointments();
            if (list.length === 0) {
                alert('No hay citas para exportar.');
                return;
            }

            let csv = '\uFEFFFolio,Paciente,Teléfono,Correo,Servicio,Fecha,Hora,PrimeraVisita,Estado,Notas\n';
            list.forEach(a => {
                const notes = (a.notes || '').replace(/\"/g, '""');
                csv += `"${a.id}","${a.patientName}","${a.patientPhone}","${a.patientEmail}","${a.serviceName}","${a.dateStr}","${a.timeStr}","${a.firstVisit}","${a.status}","${notes}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'citas_meraki_2026.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Weekly Calendar Navigation
    const weekPrevBtn = document.getElementById('week-prev-btn');
    const weekTodayBtn = document.getElementById('week-today-btn');
    const weekNextBtn = document.getElementById('week-next-btn');

    if (weekPrevBtn) {
        weekPrevBtn.addEventListener('click', () => {
            currentCalendarWeekStart.setDate(currentCalendarWeekStart.getDate() - 7);
            renderWeeklyCalendar();
        });
    }
    if (weekNextBtn) {
        weekNextBtn.addEventListener('click', () => {
            currentCalendarWeekStart.setDate(currentCalendarWeekStart.getDate() + 7);
            renderWeeklyCalendar();
        });
    }
    if (weekTodayBtn) {
        weekTodayBtn.addEventListener('click', () => {
            currentCalendarWeekStart = new Date();
            const d = currentCalendarWeekStart.getDay();
            const df = currentCalendarWeekStart.getDate() - d + (d === 0 ? -6 : 1);
            currentCalendarWeekStart.setDate(df);
            currentCalendarWeekStart.setHours(0, 0, 0, 0);
            renderWeeklyCalendar();
        });
    }

    // Modal close & action handlers
    const modal = document.getElementById('appointment-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    function renderDashboard() {
        const all = getAppointments();
        const todayStr = new Date().toISOString().split('T')[0];

        // Stats summary
        const todayAppts = all.filter(a => a.dateStr === todayStr && a.status !== 'cancelada');
        const newPatientsCount = all.filter(a => a.firstVisit === 'yes' && a.status !== 'cancelada').length;
        const estimatedRev = todayAppts.reduce((sum, a) => sum + Number(a.price || 800), 0);

        const elTodayCount = document.getElementById('stats-today-count');
        const elNewPatients = document.getElementById('stats-new-patients');
        const elRev = document.getElementById('stats-estimated-revenue');
        if (elTodayCount) elTodayCount.textContent = todayAppts.length;
        if (elNewPatients) elNewPatients.textContent = newPatientsCount;
        if (elRev) elRev.textContent = `$${estimatedRev.toLocaleString()}`;

        if (currentView === 'list') {
            renderListTable(all);
        } else {
            renderWeeklyCalendar(all);
        }
    }

    function renderListTable(allList = null) {
        const list = allList || getAppointments();
        const tbody = document.getElementById('admin-table-body');
        const mobileCards = document.getElementById('admin-mobile-cards');
        const emptyState = document.getElementById('admin-empty-state');
        if (!tbody || !mobileCards || !emptyState) return;

        const todayStr = new Date().toISOString().split('T')[0];

        // Filter logic
        let filtered = list;
        if (currentFilter === 'today') {
            filtered = list.filter(a => a.dateStr === todayStr);
        } else if (currentFilter === 'week') {
            const startWeek = new Date();
            const day = startWeek.getDay();
            const diff = startWeek.getDate() - day + (day === 0 ? -6 : 1);
            const mon = new Date(startWeek.setDate(diff));
            mon.setHours(0, 0, 0, 0);
            const sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            sun.setHours(23, 59, 59, 999);

            filtered = list.filter(a => {
                const parts = a.dateStr.split('-');
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                return d >= mon && d <= sun;
            });
        } else if (['confirmada', 'completada', 'cancelada'].includes(currentFilter)) {
            filtered = list.filter(a => a.status === currentFilter);
        }

        // Sort by date then time
        filtered.sort((a, b) => {
            const dComp = (a.dateStr || '').localeCompare(b.dateStr || '');
            if (dComp !== 0) return dComp;
            return (a.timeStr || '').localeCompare(b.timeStr || '');
        });

        tbody.innerHTML = '';
        mobileCards.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');

            filtered.forEach(a => {
                const badgeClass = `badge-${a.status || 'confirmada'}`;
                const rowClass = a.status === 'completada' || a.status === 'cancelada' ? 'admin-row-completed' : '';

                // Desktop Row
                const tr = document.createElement('tr');
                tr.className = `hover:bg-surface transition-colors ${rowClass}`;
                tr.innerHTML = `
                    <td class="py-4 px-6 font-medium text-primary">
                        ${a.patientName}
                        <span class="block text-xs font-mono text-on-surface-variant">#${a.id}</span>
                    </td>
                    <td class="py-4 px-6">${a.serviceName}</td>
                    <td class="py-4 px-6 font-medium">${a.dateStr}</td>
                    <td class="py-4 px-6">${a.timeStr} hrs</td>
                    <td class="py-4 px-6">
                        <a href="https://wa.me/52${a.patientPhone}" target="_blank" class="text-secondary hover:underline flex items-center gap-1 font-mono">
                            <span>${a.patientPhone}</span>
                            <span class="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                    </td>
                    <td class="py-4 px-6">
                        <span class="${badgeClass}">${a.status || 'confirmada'}</span>
                    </td>
                    <td class="py-4 px-6 text-right space-x-1">
                        <button class="btn-action-view p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Ver detalles" data-id="${a.id}">
                            <span class="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        ${a.status !== 'completada' && a.status !== 'cancelada' ? `
                            <button class="btn-action-complete p-1.5 text-[#25D366] hover:bg-[#25D366]/10 rounded transition-colors" title="Marcar como completada" data-id="${a.id}">
                                <span class="material-symbols-outlined text-xl">check_circle</span>
                            </button>
                            <button class="btn-action-cancel p-1.5 text-[#BA1A1A] hover:bg-[#BA1A1A]/10 rounded transition-colors" title="Cancelar cita" data-id="${a.id}">
                                <span class="material-symbols-outlined text-xl">cancel</span>
                            </button>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(tr);

                // Mobile Card
                const card = document.createElement('div');
                card.className = `bg-white p-5 rounded-xl border border-tertiary-fixed shadow-sm space-y-3 ${rowClass}`;
                card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs font-mono text-on-surface-variant font-bold">#${a.id}</span>
                            <h4 class="font-headline-md text-lg text-primary font-bold">${a.patientName}</h4>
                        </div>
                        <span class="${badgeClass}">${a.status || 'confirmada'}</span>
                    </div>
                    <div class="text-sm space-y-1 text-on-surface-variant">
                        <p><strong class="text-on-surface">Servicio:</strong> ${a.serviceName}</p>
                        <p><strong class="text-on-surface">Fecha/Hora:</strong> ${a.dateStr} - ${a.timeStr} hrs</p>
                        <p><strong class="text-on-surface">Teléfono:</strong> <a href="https://wa.me/52${a.patientPhone}" target="_blank" class="text-secondary font-bold">${a.patientPhone}</a></p>
                    </div>
                    <div class="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                        <button class="btn-action-view px-3 py-1.5 bg-primary/5 text-primary rounded font-label-md text-xs uppercase flex items-center gap-1" data-id="${a.id}">
                            <span class="material-symbols-outlined text-sm">visibility</span> Detalle
                        </button>
                        ${a.status !== 'completada' && a.status !== 'cancelada' ? `
                            <button class="btn-action-complete px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] rounded font-label-md text-xs uppercase flex items-center gap-1" data-id="${a.id}">
                                <span class="material-symbols-outlined text-sm">check</span>
                            </button>
                            <button class="btn-action-cancel px-3 py-1.5 bg-[#BA1A1A]/10 text-[#BA1A1A] rounded font-label-md text-xs uppercase flex items-center gap-1" data-id="${a.id}">
                                <span class="material-symbols-outlined text-sm">close</span>
                            </button>
                        ` : ''}
                    </div>
                `;
                mobileCards.appendChild(card);
            });

            // Bind action buttons
            bindTableActions();
        }
    }

    function bindTableActions() {
        document.querySelectorAll('.btn-action-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openAppointmentModal(id);
            });
        });

        document.querySelectorAll('.btn-action-complete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                updateAppointmentStatus(id, 'completada');
            });
        });

        document.querySelectorAll('.btn-action-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('¿Estás segura de que deseas cancelar esta cita?')) {
                    updateAppointmentStatus(id, 'cancelada');
                }
            });
        });
    }

    function updateAppointmentStatus(id, newStatus) {
        const list = getAppointments();
        const index = list.findIndex(a => a.id === id);
        if (index !== -1) {
            list[index].status = newStatus;
            saveAppointments(list);
            renderDashboard();
        }
    }

    function openAppointmentModal(id) {
        const list = getAppointments();
        const appt = list.find(a => a.id === id);
        const modal = document.getElementById('appointment-modal');
        if (!appt || !modal) return;

        document.getElementById('modal-patient-name').textContent = appt.patientName;
        document.getElementById('modal-appointment-status').textContent = appt.status || 'confirmada';
        document.getElementById('modal-appointment-status').className = `badge-${appt.status || 'confirmada'}`;
        document.getElementById('modal-service').textContent = appt.serviceName;
        document.getElementById('modal-datetime').textContent = `${appt.dateStr} a las ${appt.timeStr} hrs`;
        document.getElementById('modal-phone').textContent = appt.patientPhone;
        const phoneLink = document.getElementById('modal-phone-link');
        if (phoneLink) phoneLink.href = `https://wa.me/52${appt.patientPhone}`;
        document.getElementById('modal-first-visit').textContent = appt.firstVisit === 'yes' ? 'Sí, nuevo paciente' : 'No, ya es paciente';
        document.getElementById('modal-notes').textContent = appt.notes || 'Ninguna nota especial.';

        const btnComplete = document.getElementById('modal-complete-btn');
        const btnCancel = document.getElementById('modal-cancel-btn');
        const btnWa = document.getElementById('modal-wa-btn');

        if (btnWa) btnWa.href = `https://wa.me/52${appt.patientPhone}?text=${encodeURIComponent('Hola ' + appt.patientName + ', te contactamos de Meraki Dental Care respecto a tu cita del ' + appt.dateStr + ' a las ' + appt.timeStr + ' hrs.')}`;

        if (btnComplete) {
            btnComplete.style.display = appt.status === 'confirmada' ? 'flex' : 'none';
            btnComplete.onclick = () => {
                updateAppointmentStatus(id, 'completada');
                modal.classList.add('hidden');
            };
        }

        if (btnCancel) {
            btnCancel.style.display = appt.status === 'confirmada' ? 'flex' : 'none';
            btnCancel.onclick = () => {
                if (confirm('¿Cancelar esta cita?')) {
                    updateAppointmentStatus(id, 'cancelada');
                    modal.classList.add('hidden');
                }
            };
        }

        modal.classList.remove('hidden');
    }

    function renderWeeklyCalendar(allList = null) {
        const grid = document.getElementById('weekly-calendar-grid');
        const rangeLabel = document.getElementById('week-range-label');
        if (!grid || !rangeLabel) return;

        const list = allList || getAppointments();
        grid.innerHTML = '';

        const start = new Date(currentCalendarWeekStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        rangeLabel.textContent = `Del ${start.getDate()} ${monthNamesShort[start.getMonth()]} al ${end.getDate()} ${monthNamesShort[end.getMonth()]} de ${start.getFullYear()}`;

        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(start);
            dayDate.setDate(start.getDate() + i);
            const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSunday = i === 6;

            const dayAppts = list.filter(a => a.dateStr === dateStr && a.status !== 'cancelada');
            dayAppts.sort((a, b) => (a.timeStr || '').localeCompare(b.timeStr || ''));

            const col = document.createElement('div');
            col.className = `bg-surface-container-lowest border rounded-lg p-3 flex flex-col justify-between ${isToday ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' : 'border-outline-variant/30'}`;

            col.innerHTML = `
                <div>
                    <div class="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/20">
                        <span class="font-label-md text-xs uppercase tracking-wider ${isToday ? 'text-secondary font-bold' : 'text-on-surface-variant'}">${dayNames[i]}</span>
                        <span class="text-xs font-mono font-bold ${isToday ? 'bg-secondary text-white px-2 py-0.5 rounded-full' : 'text-primary'}">${dayDate.getDate()}/${dayDate.getMonth() + 1}</span>
                    </div>
                    
                    <div class="space-y-2">
                        ${isSunday ? `<p class="text-center text-xs text-outline-variant italic py-6">Cerrado</p>` : ''}
                        ${!isSunday && dayAppts.length === 0 ? `<p class="text-center text-xs text-outline-variant py-6">Sin citas</p>` : ''}
                        ${dayAppts.map(a => `
                            <div class="calendar-event cursor-pointer p-2 rounded.5 bg-surface-container-low border border-outline-variant/40 hover:border-secondary transition-all text-left shadow-2xs group" data-id="${a.id}">
                                <div class="flex justify-between items-center text-xs font-bold text-primary mb-0.5">
                                    <span>${a.timeStr}</span>
                                    <span class="w-2 h-2 rounded-full ${a.status === 'completada' ? 'bg-[#25D366]' : 'bg-secondary'}"></span>
                                </div>
                                <p class="text-xs font-medium text-on-surface truncate group-hover:text-secondary transition-colors">${a.patientName}</p>
                                <p class="text-[10px] text-on-surface-variant truncate">${a.serviceName}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${!isSunday ? `<div class="mt-3 pt-2 border-t border-outline-variant/10 text-[10px] text-right text-on-surface-variant">${dayAppts.length} citas</div>` : ''}
            `;

            grid.appendChild(col);
        }

        // Bind clicks on calendar events
        grid.querySelectorAll('.calendar-event').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                openAppointmentModal(id);
            });
        });
    }

    checkAuth();
}

