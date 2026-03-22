/* 
  Bhupesh Chauhan Portfolio - Unified App Logic
  Performance-Optimized Edition
*/

// 1. Global State & Config
const App = {
    _raf: {},       // track rAF ids for cleanup
    _timers: [],    // track timeouts for cleanup
    _cursorHandlers: null, // store cursor event listeners for cleanup
    _revealObserver: null,
    _countObserver: null,
    _scrollDirection: 1,
    _lastScrollY: 0,

    init() {
        // Disabled split-text as it was breaking title layouts and delaying reveals
        // this.initSplitText();
        this.initLenis();
        this.initTheme();
        this.initTyping();
        this._revealObserver = null; // Ensure clean state
        this.initAnimations();
        this.initProjectData();
        this.initResearch();
        this.initMenu();
        this.initBackToTop();
        this.initForm();
        this.initCursor();
        this.initMagnetic();
        this.initScrollspy();
        this.initGithubStats();
        this.initCertificates();
        this.initCountUp();
        this.initVisibility();
        this.initImageReveals();

        // Initial state
        document.body.classList.add('is-loading');
    },

    // 2. Smooth Scroll (Lenis) — single GSAP ticker drives Lenis
    initLenis() {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;

        const lenis = new Lenis({
            duration: isTouchDevice ? 0.6 : 1.1, // Smooth luxurious duration
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: isTouchDevice ? 0.8 : 1.0, 
            touchMultiplier: isTouchDevice ? 1.05 : 1.25,
        });

        lenis.on('scroll', (event) => {
            ScrollTrigger.update();

            if (typeof event?.direction === 'number') {
                this._scrollDirection = event.direction;
            } else if (typeof event?.scroll === 'number') {
                this._scrollDirection = event.scroll >= this._lastScrollY ? 1 : -1;
                this._lastScrollY = event.scroll;
            }
        });
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(1000, 16);

        // Scroll Progress
        gsap.to('.scroll-progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });

        this.lenis = lenis;
    },

    // 3. Theme Management
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const moonIcon = document.querySelector('.moon-icon');
        const sunIcon = document.querySelector('.sun-icon');

        const updateIcons = (theme) => {
            if (!moonIcon || !sunIcon) return;
            if (theme === 'dark-mode') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline-block';
            } else {
                moonIcon.style.display = 'inline-block';
                sunIcon.style.display = 'none';
            }
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', String(theme === 'dark-mode'));
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light-mode';
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(savedTheme);
        updateIcons(savedTheme);

        themeToggle?.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            const newTheme = isDark ? 'light-mode' : 'dark-mode';
            body.classList.remove('light-mode', 'dark-mode');
            body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcons(newTheme);
        });
    },

    // 4. Typing Animation — pauses when tab is hidden
    initTyping() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;
        const phrases = ["B.Tech IT Student", "AI Enthusiast", "Full Stack Developer", "Problem Solver"];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;

        const type = () => {
            if (document.hidden) {
                // Pause when tab is not visible — saves CPU
                this._timers.push(setTimeout(type, 1000));
                return;
            }
            const currentPhrase = phrases[phraseIndex];

            typingText.textContent = isDeleting
                ? currentPhrase.substring(0, charIndex - 1)
                : currentPhrase.substring(0, charIndex + 1);

            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            let typeSpeed = isDeleting ? 50 : 150;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            this._timers.push(setTimeout(type, typeSpeed));
        };
        type();
    },

    // 5. Project Management
    projectData: [
        { title: "TollFuel Pro", desc: "Smart Toll & Fuel Utility App", tags: ["App", "Flutter"], icon: "ri-gas-station-line", image: "assets/images/TollFuel Pro.png", imageClass: "project-cover-image project-cover-image-panorama", imageBoxClass: "project-image-box project-image-box-panorama", imageBg: "#ffffff", github: "https://github.com/bhupeshchauhanz/TollFuel-Pro", live: "https://bhupeshchauhan.in/TollFuel-Pro", status: "Prototype" },
        { title: "SyncTune", desc: "Music That Brings Everyone Into the Same Rhythm", tags: ["App", "Flutter"], icon: "ri-music-2-line", image: "assets/images/SyncTune.png", imageClass: "project-cover-image project-cover-image-panorama", imageBoxClass: "project-image-box project-image-box-panorama", imageBg: "#ffffff", github: "https://github.com/bhupeshchauhanz/SyncTune", live: "https://bhupeshchauhan.in/SyncTune", status: "Concept" },
        { title: "Expensibly", desc: "Multi-Service Personal Finance System", tags: ["MERN", "JS"], icon: "ri-money-dollar-circle-line", image: "assets/images/Expensibly.png", imageClass: "project-cover-image project-cover-image-panorama", imageBoxClass: "project-image-box project-image-box-panorama", imageBg: "#ffffff", github: "https://github.com/bhupeshchauhanz/Expensibly", live: "https://bhupeshchauhan.in/Expensibly", status: "In Progress" },
        { title: "NutriSeva", desc: "Smart Nutrition Recommendation Platform", tags: ["AI", "Python"], icon: "ri-heart-pulse-line", image: "assets/images/NutriSeva.png", imageClass: "project-cover-image project-cover-image-panorama", imageBoxClass: "project-image-box project-image-box-panorama", imageBg: "#ffffff", github: "https://github.com/bhupeshchauhanz/Nutriseva", live: "https://bhupeshchauhan.in/NutriSeva", status: "Research" },
        { title: "Skylook", desc: "Weather Forecasting System", tags: ["JS", "API"], icon: "ri-sun-cloudy-line", image: "assets/images/Skylook.png", imageClass: "project-cover-image project-cover-image-panorama project-cover-image-skylook", imageBoxClass: "project-image-box project-image-box-panorama project-image-box-skylook", imageBg: "#0f1118", github: "https://github.com/bhupeshchauhanz/Weather-Forecasting", live: "https://bhupeshchauhan.in/Skylook", status: "Demo" }
    ],


    initProjectData() {
        const grid = document.getElementById('projects-grid');
        const filterBtns = document.querySelectorAll('.tag-btn');
        if (!grid) return;

        const render = (filter = 'all') => {
            const filtered = filter === 'all' ? this.projectData : this.projectData.filter(p => p.tags.some(t => t.toUpperCase().includes(filter.toUpperCase())));
            grid.innerHTML = filtered.map((p, i) => `
                <div class="project-card" data-index="${i}" role="button" tabindex="0" aria-label="Open ${p.title} project details">
                    <div class="${p.imageBoxClass || 'project-image-box'}" style="--project-image-bg: ${p.imageBg || 'var(--color-hover)'};">
                        ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" class="${p.imageClass || 'project-cover-image'}">` : `<i class="${p.icon} project-icon"></i>`}
                    </div>
                    <div class="project-content">
                        <div class="project-tags">${p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}</div>
                        <h3 class="subheading">${p.title}</h3>
                        <p class="body-copy">${p.desc}</p>
                        <span class="label btn-view-project" aria-hidden="true">View Project →</span>
                    </div>
                </div>
            `).join('');

            if (this._revealObserver) {
                this.prepareRevealElements(grid.querySelectorAll('.project-card'), { step: 0.05, variant: 'fade' });
                this.prepareRevealElements(grid.querySelectorAll('.project-image-box'), { step: 0.04, variant: 'media' });
            }
        };

        render();
        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.dataset.filter);
        }));

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const index = Number(card.dataset.index);
            this.openModal(this.projectData[index]);
        });

        grid.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;

            const card = e.target.closest('.project-card');
            if (!card) return;

            e.preventDefault();
            const index = Number(card.dataset.index);
            this.openModal(this.projectData[index]);
        });

        const modal = document.getElementById('project-modal');
        modal?.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal());
        modal?.querySelector('.modal-overlay')?.addEventListener('click', () => this.closeModal());
    },

    // 5.1 Research Management
    researchData: [
        {
            title: "Enhancing Communication Security and User Privacy to Combat Digital Scams",
            publisher: "IJSRET Journal",
            date: "May 2025",
            desc: "This research investigates vulnerabilities in phone-based communication and proposes a privacy-centric framework to prevent unauthorized contact and digital scams.",
            link: "https://ijsret.com/wp-content/uploads/2025/05/IJSRET_V11_issue3_895.pdf"
        }
    ],

    initSplitText() {
        // Excluded .section-title to prevent scroll trigger delays
        const headings = document.querySelectorAll('.hero-title, .subheading');
        headings.forEach(heading => {
            const nodes = Array.from(heading.childNodes);
            heading.innerHTML = '';
            nodes.forEach(node => {
                if (node.nodeType === 3) { // Text node
                    const words = node.textContent.split(/(\s+)/); // Keep spaces
                    words.forEach(word => {
                        if (/\s+/.test(word)) {
                            heading.appendChild(document.createTextNode(word));
                        } else if (word.length) {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'word-span';
                            wordSpan.style.display = 'inline-block';
                            wordSpan.style.whiteSpace = 'nowrap';

                            const chars = word.split('');
                            chars.forEach(char => {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.style.display = 'inline-block';
                                span.textContent = char;
                                wordSpan.appendChild(span);
                            });
                            heading.appendChild(wordSpan);
                        }
                    });
                } else { // Element node (like <br>)
                    heading.appendChild(node.cloneNode(true));
                }
            });
        });
    },

    initImageReveals() {
        const images = document.querySelectorAll('.project-image-box, .hero-image-wrapper, .skill-icon-badge, .certificate-image-box');
        this.prepareRevealElements(images, { step: 0.04, variant: 'media' });
    },

    initResearch() {
        const grid = document.getElementById('research-grid');
        if (!grid) return;

        grid.innerHTML = this.researchData.map((paper, i) => `
            <div class="research-card glass" data-index="${i}">
                <div class="research-header">
                    <i class="ri-file-list-3-line research-icon"></i>
                    <span class="label">${paper.date}</span>
                </div>
                <div class="research-content">
                    <h3 class="subheading">${paper.title}</h3>
                    <p class="body-small publisher">${paper.publisher}</p>
                    <p class="body-medium">${paper.desc}</p>
                    <a href="${paper.link}" class="btn-read-paper" target="_blank">Read Paper →</a>
                </div>
            </div>
        `).join('');

        if (this._revealObserver) {
            this.prepareRevealElements(grid.querySelectorAll('.research-card'), { step: 0.06, variant: 'fade' });
        }
    },

    // 5.2 Certificate Management
    initCertificates() {
        const grid = document.getElementById('certificates-grid');
        const filterBar = document.getElementById('cert-filter-bar');
        if (!grid) return;

        const certs = window.CertificatesData || [];

        // Render all cards with data-category attribute
        grid.innerHTML = certs.map((cert, i) => `
            <div class="certificate-card" data-index="${i}" data-category="${cert.category || 'Other'}">
                <div class="certificate-image-box">
                    <img src="${cert.image}" alt="${cert.title}" decoding="async">
                </div>
                <div class="certificate-content">
                    <div class="certificate-tags">
                        ${cert.tags.map(tag => `<span class="certificate-tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="subheading certificate-card-title">${cert.title}</h3>
                    <p class="body-small certificate-card-meta">${cert.provider} • ${cert.date}</p>
                    <button class="btn-view-cert">View Full →</button>
                </div>
            </div>
        `).join('');

        // Update "All" count badge
        const countAll = document.getElementById('count-all');
        if (countAll) countAll.textContent = certs.length;

        // Filter logic without animation for maximum performance
        const applyFilter = (filter) => {
            const cards = grid.querySelectorAll('.certificate-card');
            let visibleCount = 0;

            cards.forEach((card) => {
                const category = card.dataset.category;
                const isMatch = filter === 'all' || category === filter;

                if (isMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Refresh layout engine
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        };

        // Wire up filter buttons
        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                const btn = e.target.closest('.cert-filter-btn');
                if (!btn) return;

                // Update active state
                filterBar.querySelectorAll('.cert-filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                applyFilter(btn.dataset.filter);
            });
        }

        // Click-to-open modal
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.certificate-card');
            if (card) {
                const cert = certs[card.dataset.index];
                this.openCertModal(cert);
            }
        });

        const cards = grid.querySelectorAll('.certificate-card');


        // Refresh ScrollTrigger after dynamic injection
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    },

    initRevealObserver() {
        if (this._revealObserver) return;

        this._revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const shouldSkipTransition = this._scrollDirection < 0;
                if (shouldSkipTransition) {
                    entry.target.classList.add('reveal-no-anim');
                    entry.target.style.setProperty('--reveal-delay', '0s');
                }

                entry.target.classList.add('is-visible');
                this._revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -10% 0px'
        });
    },

    prepareRevealElements(elements, { step = 0.06, variant = 'fade' } = {}) {
        const isMobile = window.innerWidth < 768;
        const maxIndex = isMobile ? 4 : 8;
        const effectiveStep = isMobile ? Math.min(step, 0.04) : step;

        Array.from(elements).forEach((el, index) => {
            if (!(el instanceof HTMLElement) || el.dataset.revealReady === 'true') return;

            el.dataset.revealReady = 'true';
            el.classList.add('reveal-on-scroll', variant === 'media' ? 'reveal-media' : 'reveal-fade-up');
            el.style.setProperty('--reveal-delay', `${Math.min(index, maxIndex) * effectiveStep}s`);

            if (this._revealObserver) {
                this._revealObserver.observe(el);
            }
        });
    },

    openCertModal(cert) {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        this.renderModal({
            eyebrow: cert.provider,
            title: cert.title,
            meta: cert.date,
            tags: cert.tags,
            media: `
                <div class="modal-media-frame modal-media-frame-cert">
                    <img src="${cert.image}" alt="${cert.title}" class="modal-media-image modal-media-image-contain">
                </div>
            `,
            description: 'Certificate preview with improved readability and cleaner spacing.',
            actions: `
                <a href="${cert.image}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Full Image</a>
            `
        });
    },

    openModal(project) {
        const imageContent = project.image
            ? `<div class="modal-media-frame"><img src="${project.image}" alt="${project.title}" class="modal-media-image"></div>`
            : `<div class="modal-media-frame modal-media-icon-frame"><i class="${project.icon} modal-icon"></i></div>`;

        const liveAction = project.live
            ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Live Preview</a>`
            : `<button class="btn btn-secondary" type="button" disabled>Live Preview Soon</button>`;

        this.renderModal({
            eyebrow: project.status || 'Project',
            title: project.title,
            meta: project.tags.join(' / '),
            tags: project.tags,
            media: imageContent,
            description: project.desc,
            actions: `
                <a href="${project.github || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">GitHub</a>
                ${liveAction}
            `
        });
    },

    renderModal({ eyebrow = '', title = '', meta = '', tags = [], media = '', description = '', actions = '' }) {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        const tagMarkup = tags.length
            ? `<div class="modal-tag-row">${tags.map((tag) => `<span class="modal-tag">${tag}</span>`).join('')}</div>`
            : '';

        modal.querySelector('.modal-body').innerHTML = `
            <div class="modal-shell">
                <div class="modal-media-panel">
                    ${media}
                </div>
                <div class="modal-info-panel">
                    ${eyebrow ? `<span class="label modal-eyebrow">${eyebrow}</span>` : ''}
                    <h2 class="modal-title">${title}</h2>
                    ${meta ? `<p class="modal-meta">${meta}</p>` : ''}
                    ${tagMarkup}
                    ${description ? `<p class="body-large modal-description">${description}</p>` : ''}
                    <div class="modal-actions">${actions}</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (this.lenis) this.lenis.stop();
        this._addModalEscHandler();
    },


    _addModalEscHandler() {
        this._removeModalEscHandler();
        this._modalEscHandler = (e) => { if (e.key === 'Escape') this.closeModal(); };
        document.addEventListener('keydown', this._modalEscHandler);
    },

    _removeModalEscHandler() {
        if (this._modalEscHandler) {
            document.removeEventListener('keydown', this._modalEscHandler);
            this._modalEscHandler = null;
        }
    },

    closeModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (this.lenis) this.lenis.start();
        this._removeModalEscHandler();
    },

    // 6. Navigation & Menu
    initMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-link');

        const toggleMenu = (state) => {
            const isOpen = Boolean(state);
            hamburger?.classList.toggle('active', isOpen);
            hamburger?.setAttribute('aria-expanded', String(isOpen));
            navLinks?.classList.toggle('active', isOpen);
            
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                // Staggered reveal for mobile links
                gsap.fromTo('.nav-link', 
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2, overwrite: true }
                );
            } else {
                document.body.style.overflow = '';
            }
        };

        hamburger?.addEventListener('click', () => toggleMenu(!(navLinks?.classList.contains('active'))));
        links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

        // Passive scroll listener for navbar — no layout thrash
        const navbar = document.querySelector('.navbar');
        let lastScrolled = false;
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            if (scrolled !== lastScrolled) {
                navbar?.classList.toggle('scrolled', scrolled);
                lastScrolled = scrolled;
            }
        }, { passive: true });

        // Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;

                const top = target.offsetTop - 80;
                if (this.lenis?.scrollTo) {
                    this.lenis.scrollTo(top, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    },

    // 6.1 Back to Top Button
    initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        const toggleVisible = (scrollY) => {
            const shouldShow = scrollY > 300;
            btn.classList.toggle('visible', shouldShow);
        };

        if (this.lenis?.on) {
            this.lenis.on('scroll', ({ scroll, direction }) => {
                this._scrollDirection = typeof direction === 'number' ? direction : (scroll >= this._lastScrollY ? 1 : -1);
                this._lastScrollY = scroll;
                toggleVisible(scroll);
            });
        } else {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    this._scrollDirection = window.scrollY >= this._lastScrollY ? 1 : -1;
                    this._lastScrollY = window.scrollY;
                    toggleVisible(window.scrollY);
                    ticking = false;
                });
            }, { passive: true });
        }

        btn.addEventListener('click', () => {
            if (this.lenis?.scrollTo) {
                this.lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        toggleVisible(window.scrollY);
    },

    // 7. GSAP Animations
    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({
            ease: 'power2.out',
            duration: 0.6
        });

        this.initRevealObserver();
        // Standalone text elements: no stagger needed (animate instantly)
        this.prepareRevealElements(document.querySelectorAll('.section-title, .about-intro .body-large, .stat-massive, .statement-text'), { step: 0, variant: 'fade' });

        // Repeating grid elements: stagger them
        const gridSelectors = ['.stat-card', '.experience-card', '.process-step', '.skill-card', '.timeline-row', '.project-card', '.research-card'];
        gridSelectors.forEach(sel => {
            this.prepareRevealElements(document.querySelectorAll(sel), { step: 0.06, variant: 'fade' });
        });

        // Media elements
        this.prepareRevealElements(document.querySelectorAll('.project-image-box, .hero-image-wrapper, .skill-icon-badge'), { step: 0.04, variant: 'media' });
        // Cinematic Loader Sequence
        const loader = document.querySelector('.js-loader');
        const loaderProgress = document.querySelector('.loader-progress');
        const loaderBar = document.querySelector('.loader-bar');
        const loaderLogo = document.querySelector('.loader-logo');

        if (loader) {
            const tlLoader = gsap.timeline();

            tlLoader.to(loaderLogo, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
                .to({}, {
                    duration: 0.45,
                    onUpdate: function () {
                        const prog = Math.round(this.progress() * 100);
                        if (loaderProgress) loaderProgress.textContent = prog + '%';
                        if (loaderBar) loaderBar.style.width = prog + '%';
                    }
                })
                .to(loader, {
                    y: "-100%",
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        loader.style.display = 'none';
                        document.body.classList.remove('is-loading');
                        this.startHeroReveal();
                    }
                });
        } else {
            this.startHeroReveal();
        }
    },

    startHeroReveal() {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        const heroElems = ['.hero-title', '.hero-description', '.hero-social-link', '.hero-btns', '.hero-image-wrapper'];
        const existingElems = heroElems.filter(sel => document.querySelector(sel));

        gsap.set(existingElems, { opacity: 1, visibility: 'visible' });

        if (document.querySelector('.hero-title')) {
            const words = document.querySelectorAll('.hero-title .word-span');
            if (words.length) {
                tl.from(words, { 
                    y: 35, 
                    opacity: 0, 
                    stagger: 0.07, 
                    duration: 0.5, 
                    ease: 'power2.out', 
                    clearProps: 'all' 
                }, 0);
            } else {
                tl.from('.hero-title', { y: 36, opacity: 0, duration: 0.8, clearProps: 'all' });
            }
        }

        // Add continuous slower floating delay to portrait
        if (document.querySelector('.hero-image-wrapper')) {
            gsap.to('.hero-image-wrapper', {
                y: -12,
                duration: 2.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1.2
            });
        }
        if (document.querySelector('.hero-description')) {
            tl.from('.hero-description', { y: 16, opacity: 0, duration: 0.6, clearProps: 'all' }, '-=0.5');
        }
        if (document.querySelector('.hero-social-link')) {
            tl.from('.hero-social-link', { y: 12, opacity: 0, duration: 0.45, stagger: 0.06, clearProps: 'all' }, '-=0.35');
        }
        if (document.querySelector('.hero-btns')) {
            tl.from('.hero-btns', { y: 16, opacity: 0, duration: 0.55, clearProps: 'all' }, '-=0.25');
        }
        if (document.querySelector('.hero-image-wrapper')) {
            tl.from('.hero-image-wrapper', { scale: 0.92, opacity: 0, duration: 0.95, ease: 'power2.out', clearProps: 'all' }, 0);
        }
    },

    // 8. Magnetic Effect — only on buttons/social links
    initMagnetic() {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!canHover || reduceMotion || window.innerWidth < 1280) return;

        document.querySelectorAll('.btn, .hero-social-link').forEach(btn => {
            let ticking = false;
            btn.addEventListener('mousemove', (e) => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const rect = btn.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.16;
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.16;
                    gsap.to(btn, { x, y, duration: 0.22, ease: "power2.out", overwrite: true });
                    ticking = false;
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.28, ease: "power3.out", overwrite: true });
            });
        });
    },

    // 9. Tilt Effect — reduced to max 6deg, GPU-friendly
    initTilt() {
        return;
    },

    // 10. Scrollspy
    initScrollspy() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const sections = Array.from(navLinks)
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(section => section !== null);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.1, rootMargin: "-20% 0px -30% 0px" });

        sections.forEach(section => observer.observe(section));
    },

    // 11. Form Handling
    initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        const endpoint = 'https://formsubmit.co/ajax/support@bhupeshchauhan.in';
        const original = btn.innerHTML;
        let isSending = false;

        let status = form.querySelector('.form-status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'form-status';
            status.setAttribute('aria-live', 'polite');
            form.appendChild(status);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSending) return;

            isSending = true;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            status.textContent = '';
            status.classList.remove('is-success', 'is-error');

            try {
                const formData = new FormData(form);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json'
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const result = await response.json();
                if (result?.success !== 'true' && result?.success !== true) {
                    throw new Error(result?.message || 'Unable to send message');
                }

                btn.innerHTML = 'Sent! <i class="ri-check-line"></i>';
                status.textContent = 'Message sent successfully. I will reply soon.';
                status.classList.add('is-success');
                form.reset();
            } catch (error) {
                console.error('Contact form submit failed:', error);
                status.textContent = 'Could not send right now. Please email support@bhupeshchauhan.in directly.';
                status.classList.add('is-error');
            } finally {
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    isSending = false;
                }, 1800);
            }
        });
    },

    // 12. Custom Cursor — uses gsap.quickSetter for zero-allocation updates
    initCursor() {
        if (window.innerWidth <= 1024) return;
        this.destroyCursor();

        const cursor = document.querySelector('.js-cursor');
        const follower = document.querySelector('.js-follower');
        const glow = document.querySelector('.js-cursor-glow');
        if (!cursor || !follower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let glowX = 0, glowY = 0;

        const updateCursor = () => {
            // Direct transform updating is highly optimized for compositing
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;

            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;

            if (glow) {
                glowX += (mouseX - glowX) * 0.08;
                glowY += (mouseY - glowY) * 0.08;
                glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
            }

            this._raf.cursor = requestAnimationFrame(updateCursor);
        };

        const mousemoveHandler = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const activeSelectors = 'a, button, .project-card, .research-card, .certificate-card, .tag-btn, [role="button"], #theme-toggle, .hero-social-link';

        const mouseoverHandler = (e) => {
            if (e.target.closest(activeSelectors)) {
                cursor.classList.add('active');
                follower.classList.add('active');
            }
        };

        const mouseoutHandler = (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest(activeSelectors)) {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            }
        };

        window.addEventListener('mousemove', mousemoveHandler, { passive: true });
        window.addEventListener('mouseover', mouseoverHandler, { passive: true });
        window.addEventListener('mouseout', mouseoutHandler, { passive: true });

        this._cursorHandlers = {
            mousemove: mousemoveHandler,
            mouseover: mouseoverHandler,
            mouseout: mouseoutHandler
        };

        this._raf.cursor = requestAnimationFrame(updateCursor);
    },

    destroyCursor() {
        if (this._raf.cursor) {
            cancelAnimationFrame(this._raf.cursor);
            this._raf.cursor = null;
        }
        if (this._cursorHandlers) {
            window.removeEventListener('mousemove', this._cursorHandlers.mousemove);
            window.removeEventListener('mouseover', this._cursorHandlers.mouseover);
            window.removeEventListener('mouseout', this._cursorHandlers.mouseout);
            this._cursorHandlers = null;
        }
    },

    // 13. GitHub Integration
    async initGithubStats() {
        const repoDisplay = document.querySelector('.github-repo-count');
        const statusText = document.querySelector('.js-github-stats .body-small');
        if (!repoDisplay) return;

        try {
            const response = await fetch('https://api.github.com/users/bhupeshchauhanz');
            if (!response.ok) throw new Error('GitHub API Fail');
            const data = await response.json();

            // Sync with count-up: update data-target instead of textContent
            if (data.public_repos) {
                repoDisplay.dataset.target = data.public_repos;
            }
            if (statusText) statusText.textContent = 'Active Contributor on GitHub';
        } catch (error) {
            console.error('GitHub Fetch Error:', error);
            // Fallback is already in HTML (data-target="5")
            if (statusText) statusText.textContent = 'Passionate Open Source Developer';
        }
    },

    // 14. Resize Handler — debounced
    initResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
                if (this.lenis) this.lenis.resize();
            }, 300);
        }, { passive: true });
    },

    // 15. Count-Up Animation for Stats
    initCountUp() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        if (this._countObserver) {
            this._countObserver.disconnect();
        }

        this._countObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.counted === 'true') return;

                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                el.dataset.counted = 'true';

                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 1.25,
                    ease: 'power2.out',
                    onUpdate: function () {
                        el.textContent = Math.round(this.targets()[0].val) + suffix;
                    }
                });

                this._countObserver.unobserve(el);
            });
        }, {
            threshold: 0.6
        });

        statNumbers.forEach((el) => this._countObserver.observe(el));
    },

    // 16. Visibility API — pause heavy work when tab is hidden
    initVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause marquee CSS animation
                document.querySelectorAll('.marquee-track').forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
                // Pause spinning badge
                document.querySelectorAll('.rotating-badge svg').forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
                // Pause cursor updates
                this.destroyCursor();
            } else {
                // Resume animations
                document.querySelectorAll('.marquee-track, .rotating-badge svg').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
                // Restart cursor
                if (window.innerWidth > 1024) {
                    this.initCursor();
                }
            }
        });
    }
}

// Expose App globally
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.initResize();
});
