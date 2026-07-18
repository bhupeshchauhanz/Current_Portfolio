/**
 * Bhupesh Chauhan Portfolio — App Logic
 * Clean, modular, performance-optimized
 */

'use strict';

const App = {
    _raf: {},
    _timers: [],
    _cursorHandlers: null,
    _revealObserver: null,
    _countObserver: null,
    _scrollDirection: 1,
    _lastScrollY: 0,
    lenis: null,

    // Cached DOM queries
    _cache: {},

    /** Get or cache a DOM element */
    $(selector) {
        return this._cache[selector] || (this._cache[selector] = document.querySelector(selector));
    },

    // ─── Initialize ───────────────────────────────────────
    init() {
        document.body.classList.add('is-loading');
        this.initLenis();
        this.initTheme();
        this.initTyping();
        this.initAnimations();
        this.initProjectData();
        this.initResearch();
        this.initMenu();
        this.initResumeDropdown();
        this.initBackToTop();
        this.initForm();
        this.initCursor();
        this.initMagnetic();
        this.initScrollspy();
        this.initCertificates();
        this.initCountUp();
        this.initVisibility();
        this.initImageReveals();
        this.initResize();
    },

    // ─── Smooth Scroll (Lenis) ────────────────────────────
    initLenis() {
        const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
        const easeOut = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

        const lenis = new Lenis({
            duration: isTouch ? 0.6 : 1.1,
            easing: easeOut,
            smoothWheel: true,
            wheelMultiplier: isTouch ? 0.8 : 1.0,
            touchMultiplier: isTouch ? 1.05 : 1.25,
        });

        lenis.on('scroll', ({ direction, scroll }) => {
            this._scrollDirection = typeof direction === 'number'
                ? direction
                : (scroll >= this._lastScrollY ? 1 : -1);
            if (typeof scroll === 'number') this._lastScrollY = scroll;
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
            ScrollTrigger.update();
        });
        gsap.ticker.lagSmoothing(1000, 16);

        gsap.to('.scroll-progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 }
        });

        this.lenis = lenis;
        this._easeOut = easeOut;
    },

    // ─── Theme Toggle ─────────────────────────────────────
    initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const body = document.body;
        const moonIcon = document.querySelector('.moon-icon');
        const sunIcon = document.querySelector('.sun-icon');

        const applyTheme = (theme) => {
            body.className = body.className.replace(/\b(light|dark)-mode\b/g, '').trim() + ' ' + theme;
            if (moonIcon) moonIcon.style.display = theme === 'dark-mode' ? 'none' : 'inline-block';
            if (sunIcon) sunIcon.style.display = theme === 'dark-mode' ? 'inline-block' : 'none';
            if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark-mode'));
        };

        applyTheme(localStorage.getItem('theme') || 'light-mode');

        toggle?.addEventListener('click', () => {
            const next = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    },

    // ─── Typing Animation ─────────────────────────────────
    initTyping() {
        const el = document.querySelector('.typing-text');
        if (!el) return;
        const phrases = ['AI Engineer', 'Full Stack Developer', 'Problem Solver', 'ML Enthusiast'];
        let idx = 0, charIdx = 0, deleting = false;

        const type = () => {
            if (document.hidden) { this._timers.push(setTimeout(type, 1000)); return; }
            const phrase = phrases[idx];
            charIdx += deleting ? -1 : 1;
            el.textContent = phrase.substring(0, charIdx);

            let speed = deleting ? 40 : 120;
            if (!deleting && charIdx === phrase.length) { deleting = true; speed = 2000; }
            else if (deleting && charIdx === 0) { deleting = false; idx = (idx + 1) % phrases.length; speed = 400; }
            this._timers.push(setTimeout(type, speed));
        };
        type();
    },

    // ─── Resume Dropdown ──────────────────────────────────
    initResumeDropdown() {
        const dropdown = document.getElementById('resume-dropdown');
        if (!dropdown) return;
        const trigger = dropdown.querySelector('.resume-dropdown-trigger');
        if (!trigger) return;

        const close = () => { dropdown.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dropdown.classList.contains('open')) { close(); trigger.focus(); } });
    },

    // ─── Project Data & Rendering ─────────────────────────
    projectData: [
        { title: 'TollFuel Pro', desc: 'Route planner for Indian highways — calculates toll charges, estimates fuel cost, and logs trip expenses offline.', tags: ['App', 'Java'], icon: 'ri-gas-station-line', image: 'assets/images/TollFuel Pro.png', imageClass: 'project-cover-image project-cover-image-panorama', imageBoxClass: 'project-image-box project-image-box-panorama', imageBg: '#ffffff', github: 'https://github.com/bhupeshchauhanz/TollFuel-Pro', live: './TollFuel-Pro/index.html', status: 'Prototype' },
        { title: 'DoTrackr', desc: 'Task & habit tracker with streak counters, GitHub-style heatmaps, and AES-256 encrypted local storage.', tags: ['App', 'Flutter'], icon: 'ri-check-double-line', image: 'assets/images/DoTrackr.png', imageClass: 'project-cover-image project-cover-image-panorama', imageBoxClass: 'project-image-box project-image-box-panorama', imageBg: '#ffffff', github: 'https://github.com/bhupeshchauhanz/DoTrackr', live: './DoTrackr/index.html', status: 'Prototype' },
        { title: 'Syncora', desc: 'Real-time synchronized media sharing platform with WebRTC calls, watch-together rooms, and persistent chat.', tags: ['MERN', 'JS'], icon: 'ri-team-line', image: 'assets/images/Syncora.png', imageClass: 'project-cover-image project-cover-image-panorama', imageBoxClass: 'project-image-box project-image-box-panorama', imageBg: '#000000', github: 'https://github.com/bhupeshchauhanz/Syncora', live: 'https://syncora.bhupeshchauhan.in', status: 'In Progress' },
        { title: 'NutriSeva', desc: 'ML-based nutrition recommendation system that suggests personalized diet plans using health and dietary data.', tags: ['AI', 'MERN', 'JS'], icon: 'ri-heart-pulse-line', image: 'assets/images/NutriSeva.png', imageClass: 'project-cover-image project-cover-image-panorama', imageBoxClass: 'project-image-box project-image-box-panorama', imageBg: '#ffffff', github: 'https://github.com/bhupeshchauhanz/Nutriseva', live: 'https://nutriseva.bhupeshchauhan.in', status: 'Research' },
        { title: 'Skylook', desc: 'Live weather forecasting app with location search, 5-day forecast, and dynamic UI based on weather conditions.', tags: ['JS', 'API'], icon: 'ri-sun-cloudy-line', image: 'assets/images/Skylook.png', imageClass: 'project-cover-image project-cover-image-panorama project-cover-image-skylook', imageBoxClass: 'project-image-box project-image-box-panorama project-image-box-skylook', imageBg: '#0f1118', github: 'https://github.com/bhupeshchauhanz/Weather-Forecasting', live: 'https://skylook.netlify.app/', status: 'Live' },
        { title: 'ChauhanQuant', desc: 'Quantitative trading engine with algorithmic strategies, backtesting, and real-time financial data analytics.', tags: ['AI', 'JS'], icon: 'ri-stock-line', image: 'assets/images/Chauhan Quant.png', imageClass: 'project-cover-image project-cover-image-panorama', imageBoxClass: 'project-image-box project-image-box-panorama', imageBg: '#000000', github: null, githubConfidential: true, live: 'https://chauhanquant.bhupeshchauhan.in', status: 'Private' }
    ],

    _buildProjectCard(p, i) {
        const esc = this._escapeHtml.bind(this);
        const imageContent = p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" class="${esc(p.imageClass || 'project-cover-image')}">`
            : `<i class="${esc(p.icon)} project-icon" aria-hidden="true"></i>`;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.title = p.title;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Open ${esc(p.title)} project details`);
        card.innerHTML = `
            <div class="${esc(p.imageBoxClass || 'project-image-box')}" style="--project-image-bg: ${esc(p.imageBg || 'var(--color-hover)')};">
                ${imageContent}
            </div>
            <div class="project-content">
                <div class="project-tags">${p.tags.map(t => `<span class="tag-pill">${esc(t)}</span>`).join('')}</div>
                <h3 class="subheading">${esc(p.title)}</h3>
                <p class="body-small text-secondary">${esc(p.desc)}</p>
                <span class="label btn-view-project" aria-hidden="true">View Project →</span>
            </div>
        `;
        return card;
    },

    /** Find project by title */
    _getProject(title) {
        return this.projectData.find(p => p.title === title);
    },

    initProjectData() {
        const grid = document.getElementById('projects-grid');
        const filterBtns = document.querySelectorAll('.tag-btn');
        if (!grid) return;

        const render = (filter = 'all') => {
            const filtered = filter === 'all'
                ? this.projectData
                : this.projectData.filter(p => p.tags.some(t => t.toUpperCase().includes(filter.toUpperCase())));

            grid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            filtered.forEach((p, i) => fragment.appendChild(this._buildProjectCard(p, i)));
            grid.appendChild(fragment);

            if (this._revealObserver) {
                this.prepareRevealElements(grid.querySelectorAll('.project-card'), { step: 0.05, variant: 'fade' });
            }
        };

        render();

        // Filter via event delegation on parent
        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.dataset.filter);
        }));

        // Project interactions via delegation — use title to find correct project
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) this.openModal(this._getProject(card.dataset.title));
        });

        grid.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const card = e.target.closest('.project-card');
            if (card) { e.preventDefault(); this.openModal(this._getProject(card.dataset.title)); }
        });

        const modal = document.getElementById('project-modal');
        modal?.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal());
        modal?.querySelector('.modal-overlay')?.addEventListener('click', () => this.closeModal());
    },

    // ─── Research ─────────────────────────────────────────
    researchData: [
        {
            title: 'Enhancing Communication Security and User Privacy to Combat Digital Scams',
            publisher: 'IJSRET Journal',
            date: 'May 2025',
            desc: 'Investigates vulnerabilities in phone-based communication and proposes a privacy-centric framework to prevent unauthorized contact and digital scams.',
            link: 'https://ijsret.com/wp-content/uploads/2025/05/IJSRET_V11_issue3_895.pdf'
        }
    ],

    initResearch() {
        const grid = document.getElementById('research-grid');
        if (!grid) return;

        const fragment = document.createDocumentFragment();
        this.researchData.forEach((paper) => {
            const card = document.createElement('article');
            card.className = 'research-card';
            card.innerHTML = `
                <div class="research-header">
                    <i class="ri-file-list-3-line research-icon" aria-hidden="true"></i>
                    <span class="label">${this._escapeHtml(paper.date)}</span>
                </div>
                <div class="research-content">
                    <h3 class="subheading">${this._escapeHtml(paper.title)}</h3>
                    <p class="body-small publisher">${this._escapeHtml(paper.publisher)}</p>
                    <p class="body-medium">${this._escapeHtml(paper.desc)}</p>
                    <a href="${this._escapeHtml(paper.link)}" class="btn-read-paper" target="_blank" rel="noopener noreferrer">Read Paper →</a>
                </div>
            `;
            fragment.appendChild(card);
        });
        grid.appendChild(fragment);

        if (this._revealObserver) {
            this.prepareRevealElements(grid.querySelectorAll('.research-card'), { step: 0.06, variant: 'fade' });
        }
    },

    // ─── Certificates ─────────────────────────────────────
    initCertificates() {
        const grid = document.getElementById('certificates-grid');
        const filterBar = document.getElementById('cert-filter-bar');
        if (!grid) return;

        const certs = window.CertificatesData || [];
        const fragment = document.createDocumentFragment();

        certs.forEach((cert, i) => {
            const card = document.createElement('div');
            card.className = 'certificate-card';
            card.dataset.index = i;
            card.dataset.category = cert.category || 'Other';
            card.innerHTML = `
                <div class="certificate-image-box">
                    <img src="${this._escapeHtml(cert.image)}" alt="${this._escapeHtml(cert.title)}" loading="lazy" decoding="async">
                </div>
                <div class="certificate-content">
                    <div class="certificate-tags">${cert.tags.map(tag => `<span class="certificate-tag">${this._escapeHtml(tag)}</span>`).join('')}</div>
                    <h3 class="subheading certificate-card-title">${this._escapeHtml(cert.title)}</h3>
                    <p class="body-small text-secondary">${this._escapeHtml(cert.provider)} · ${this._escapeHtml(cert.date)}</p>
                    <button class="btn-view-cert" aria-label="View ${this._escapeHtml(cert.title)}">View Full →</button>
                </div>
            `;
            fragment.appendChild(card);
        });
        grid.appendChild(fragment);

        const countAll = document.getElementById('count-all');
        if (countAll) countAll.textContent = certs.length;

        // Filter
        filterBar?.addEventListener('click', (e) => {
            const btn = e.target.closest('.cert-filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.cert-filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const filter = btn.dataset.filter;
            grid.querySelectorAll('.certificate-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
            });
        });

        // Open modal
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.certificate-card');
            if (card) this.openCertModal(certs[card.dataset.index]);
        });
    },

    // ─── Modal System ─────────────────────────────────────
    openCertModal(cert) {
        this.renderModal({
            eyebrow: cert.provider,
            title: cert.title,
            meta: cert.date,
            tags: cert.tags,
            media: `<div class="modal-media-frame modal-media-frame-cert"><img src="${this._escapeHtml(cert.image)}" alt="${this._escapeHtml(cert.title)}" class="modal-media-image modal-media-image-contain"></div>`,
            description: '',
            actions: `<a href="${this._escapeHtml(cert.image)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Full Image</a>`
        });
    },

    openModal(project) {
        const media = project.image
            ? `<div class="modal-media-frame"><img src="${this._escapeHtml(project.image)}" alt="${this._escapeHtml(project.title)}" class="modal-media-image"></div>`
            : `<div class="modal-media-frame modal-media-icon-frame"><i class="${this._escapeHtml(project.icon)} modal-icon" aria-hidden="true"></i></div>`;

        const liveBtn = project.live
            ? `<a href="${this._escapeHtml(project.live)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Live Preview</a>`
            : `<button class="btn btn-secondary" disabled>Live Preview Soon</button>`;

        let githubBtn;
        if (project.githubConfidential) {
            githubBtn = `<button class="btn btn-primary" onclick="alert('This project is confidential. Source code is private and not publicly available.')">GitHub</button>`;
        } else {
            githubBtn = `<a href="${this._escapeHtml(project.github || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">GitHub</a>`;
        }

        this.renderModal({
            eyebrow: project.status || 'Project',
            title: project.title,
            meta: project.tags.join(' / '),
            tags: project.tags,
            media,
            description: project.desc,
            actions: `${githubBtn}${liveBtn}`
        });
    },

    renderModal({ eyebrow = '', title = '', meta = '', tags = [], media = '', description = '', actions = '' }) {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        const tagMarkup = tags.length ? `<div class="modal-tag-row">${tags.map(t => `<span class="modal-tag">${this._escapeHtml(t)}</span>`).join('')}</div>` : '';

        modal.querySelector('.modal-body').innerHTML = `
            <div class="modal-shell">
                <div class="modal-media-panel">${media}</div>
                <div class="modal-info-panel">
                    ${eyebrow ? `<span class="label modal-eyebrow">${this._escapeHtml(eyebrow)}</span>` : ''}
                    <h2 class="modal-title">${this._escapeHtml(title)}</h2>
                    ${meta ? `<p class="modal-meta">${this._escapeHtml(meta)}</p>` : ''}
                    ${tagMarkup}
                    ${description ? `<p class="body-large modal-description">${this._escapeHtml(description)}</p>` : ''}
                    <div class="modal-actions">${actions}</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (this.lenis) this.lenis.stop();
        this._addModalEscHandler();
    },

    closeModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (this.lenis) this.lenis.start();
        this._removeModalEscHandler();
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

    // ─── Navigation & Menu ────────────────────────────────
    initMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links .nav-link');

        const toggleMenu = (open) => {
            hamburger?.classList.toggle('active', open);
            hamburger?.setAttribute('aria-expanded', String(open));
            navLinks?.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        hamburger?.addEventListener('click', () => toggleMenu(!navLinks?.classList.contains('active')));
        links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

        // Navbar scroll state
        const navbar = document.querySelector('.navbar');
        let lastScrolled = false;
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            if (scrolled !== lastScrolled) { navbar?.classList.toggle('scrolled', scrolled); lastScrolled = scrolled; }
        }, { passive: true });

        // Smooth anchor links via event delegation
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            const top = target.offsetTop - 80;
            this._scrollTo(top);
        });
    },

    /** Shared smooth scroll utility */
    _scrollTo(top) {
        if (this.lenis?.scrollTo) {
            this.lenis.scrollTo(top, { duration: 1.2, easing: this._easeOut });
        } else {
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },

    // ─── Back to Top ──────────────────────────────────────
    initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        const toggle = (scrollY) => btn.classList.toggle('visible', scrollY > 300);

        if (this.lenis?.on) {
            this.lenis.on('scroll', ({ scroll }) => toggle(scroll));
        } else {
            window.addEventListener('scroll', () => toggle(window.scrollY), { passive: true });
        }

        btn.addEventListener('click', () => this._scrollTo(0));
    },

    // ─── GSAP Animations ──────────────────────────────────
    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: 'power2.out', duration: 0.6 });

        this.initRevealObserver();

        // Prepare reveal elements
        this.prepareRevealElements(document.querySelectorAll('.section-title, .about-intro .body-large, .stat-massive, .statement-text'), { step: 0, variant: 'fade' });
        const gridSelectors = ['.process-step', '.skill-card', '.timeline-row', '.project-card', '.research-card'];
        gridSelectors.forEach(sel => this.prepareRevealElements(document.querySelectorAll(sel), { step: 0.06, variant: 'fade' }));

        // Loader
        const loader = document.querySelector('.js-loader');
        const loaderProgress = document.querySelector('.loader-progress');
        const loaderBar = document.querySelector('.loader-bar');
        const loaderLogo = document.querySelector('.loader-logo');

        if (loader) {
            const tl = gsap.timeline();
            tl.to(loaderLogo, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
              .to({}, { duration: 0.45, onUpdate() {
                  const prog = Math.round(this.progress() * 100);
                  if (loaderProgress) loaderProgress.textContent = prog + '%';
                  if (loaderBar) loaderBar.style.width = prog + '%';
              }})
              .to(loader, { y: '-100%', duration: 0.4, ease: 'power2.inOut', onComplete: () => {
                  loader.style.display = 'none';
                  document.body.classList.remove('is-loading');
                  this.startHeroReveal();
              }});
        } else {
            document.body.classList.remove('is-loading');
            this.startHeroReveal();
        }
    },

    startHeroReveal() {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        const q = (s) => document.querySelector(s);

        const heroElems = ['.hero-title', '.hero-description', '.hero-social-link', '.hero-btns', '.hero-image-wrapper'];
        gsap.set(heroElems.filter(q), { opacity: 1, visibility: 'visible' });

        if (q('.hero-title')) tl.from('.hero-title', { y: 30, opacity: 0, duration: 0.7, clearProps: 'all' });
        if (q('.hero-description')) tl.from('.hero-description', { y: 16, opacity: 0, duration: 0.5, clearProps: 'all' }, '-=0.4');
        if (q('.hero-social-link')) tl.from('.hero-social-link', { y: 12, opacity: 0, stagger: 0.06, duration: 0.4, clearProps: 'all' }, '-=0.3');
        if (q('.hero-btns')) tl.from('.hero-btns', { y: 16, opacity: 0, duration: 0.5, clearProps: 'all' }, '-=0.2');
        if (q('.hero-image-wrapper')) {
            tl.from('.hero-image-wrapper', { scale: 0.92, opacity: 0, duration: 0.8, clearProps: 'all' }, 0);
            gsap.to('.hero-image-wrapper', { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
        }
    },

    // ─── Scroll Reveal Observer ───────────────────────────
    initRevealObserver() {
        if (this._revealObserver) return;
        this._revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                if (this._scrollDirection < 0) {
                    entry.target.classList.add('reveal-no-anim');
                    entry.target.style.setProperty('--reveal-delay', '0s');
                }
                entry.target.classList.add('is-visible');
                this._revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    },

    prepareRevealElements(elements, { step = 0.06, variant = 'fade' } = {}) {
        const isMobile = window.innerWidth < 768;
        const maxIdx = isMobile ? 3 : 6;
        const effectiveStep = isMobile ? Math.min(step, 0.03) : step;

        Array.from(elements).forEach((el, i) => {
            if (!(el instanceof HTMLElement) || el.dataset.revealReady === 'true') return;
            el.dataset.revealReady = 'true';
            el.classList.add('reveal-on-scroll', variant === 'media' ? 'reveal-media' : 'reveal-fade-up');
            el.style.setProperty('--reveal-delay', `${Math.min(i, maxIdx) * effectiveStep}s`);
            if (this._revealObserver) this._revealObserver.observe(el);
        });
    },

    initImageReveals() {
        this.prepareRevealElements(document.querySelectorAll('.project-image-box, .hero-image-wrapper, .skill-icon-badge, .certificate-image-box'), { step: 0.04, variant: 'media' });
    },

    // ─── Magnetic Effect ──────────────────────────────────
    initMagnetic() {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!canHover || window.innerWidth < 1100) return;

        document.querySelectorAll('.hero-social-link').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
                gsap.to(el, { x, y, duration: 0.25, ease: 'power2.out', overwrite: true });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)', overwrite: true });
            });
        });
    },

    // ─── Scrollspy ────────────────────────────────────────
    initScrollspy() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
                }
            });
        }, { threshold: 0.1, rootMargin: '-20% 0px -30% 0px' });

        sections.forEach(s => observer.observe(s));
    },

    // ─── Contact Form ─────────────────────────────────────
    initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const btn = form.querySelector('button[type="submit"]');
        const status = form.querySelector('.form-status');
        if (!btn) return;

        const endpoint = 'https://formsubmit.co/ajax/support@bhupeshchauhan.in';
        const originalHTML = btn.innerHTML;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let sending = false;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (sending) return;

            const email = form.querySelector('[name="email"]');
            if (email && !emailRegex.test(email.value)) {
                if (status) { status.textContent = 'Please enter a valid email.'; status.className = 'form-status is-error'; }
                return;
            }

            sending = true;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            if (status) { status.textContent = ''; status.className = 'form-status'; }

            try {
                const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                if (data?.success !== 'true' && data?.success !== true) throw new Error(data?.message || 'Error');

                btn.innerHTML = 'Sent! ✓';
                if (status) { status.textContent = "Message sent successfully. I'll reply soon."; status.className = 'form-status is-success'; }
                form.reset();
            } catch {
                if (status) { status.textContent = 'Could not send. Please email support@bhupeshchauhan.in directly.'; status.className = 'form-status is-error'; }
            } finally {
                setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; sending = false; }, 2000);
            }
        });
    },

    // ─── Custom Cursor ────────────────────────────────────
    initCursor() {
        if (window.innerWidth <= 1024) return;
        this.destroyCursor();

        const cursor = document.querySelector('.js-cursor');
        const follower = document.querySelector('.js-follower');
        const glow = document.querySelector('.js-cursor-glow');
        if (!cursor || !follower) return;

        let mx = 0, my = 0, fx = 0, fy = 0, gx = 0, gy = 0;
        const hoverTargets = 'a, button, .project-card, .research-card, .certificate-card, .tag-btn, [role="button"], #theme-toggle, .hero-social-link';

        const update = () => {
            cursor.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
            fx += (mx - fx) * 0.16;
            fy += (my - fy) * 0.16;
            follower.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%)`;
            if (glow) {
                gx += (mx - gx) * 0.07;
                gy += (my - gy) * 0.07;
                glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
            }
            this._raf.cursor = requestAnimationFrame(update);
        };

        const move = (e) => { mx = e.clientX; my = e.clientY; };
        const over = (e) => {
            if (e.target.closest(hoverTargets)) { cursor.classList.add('active'); follower.classList.add('active'); }
        };
        const out = (e) => {
            if (!e.relatedTarget?.closest?.(hoverTargets)) { cursor.classList.remove('active'); follower.classList.remove('active'); }
        };

        window.addEventListener('mousemove', move, { passive: true });
        window.addEventListener('mouseover', over, { passive: true });
        window.addEventListener('mouseout', out, { passive: true });

        this._cursorHandlers = { move, over, out };
        this._raf.cursor = requestAnimationFrame(update);
    },

    destroyCursor() {
        if (this._raf.cursor) { cancelAnimationFrame(this._raf.cursor); this._raf.cursor = null; }
        if (this._cursorHandlers) {
            window.removeEventListener('mousemove', this._cursorHandlers.move);
            window.removeEventListener('mouseover', this._cursorHandlers.over);
            window.removeEventListener('mouseout', this._cursorHandlers.out);
            this._cursorHandlers = null;
        }
    },

    // ─── Count-Up Animation ───────────────────────────────
    initCountUp() {
        const nums = document.querySelectorAll('.stat-number');
        if (!nums.length) return;

        this._countObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.counted === 'true') return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                el.dataset.counted = 'true';
                gsap.to({ val: 0 }, {
                    val: target, duration: 1.2, ease: 'power2.out',
                    onUpdate() { el.textContent = Math.round(this.targets()[0].val) + suffix; }
                });
                this._countObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        nums.forEach(el => this._countObserver.observe(el));
    },

    // ─── Visibility (Pause when hidden) ───────────────────
    initVisibility() {
        const animatedEls = '.marquee-track, .rotating-badge svg';
        document.addEventListener('visibilitychange', () => {
            const state = document.hidden ? 'paused' : 'running';
            document.querySelectorAll(animatedEls).forEach(el => { el.style.animationPlayState = state; });
            if (document.hidden) this.destroyCursor();
            else if (window.innerWidth > 1024) this.initCursor();
        });
    },

    // ─── Resize Handler ───────────────────────────────────
    initResize() {
        let timeout;
        window.addEventListener('resize', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                ScrollTrigger.refresh();
                this.lenis?.resize();
            }, 250);
        }, { passive: true });
    },

    // ─── XSS Prevention ───────────────────────────────────
    _escapeMap: { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' },
    _escapeRe: /[&<>"']/g,

    _escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(this._escapeRe, (c) => this._escapeMap[c]);
    }
};

// ─── Boot ─────────────────────────────────────────────
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
