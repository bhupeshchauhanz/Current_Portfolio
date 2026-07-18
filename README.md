# Bhupesh Chauhan — Portfolio

Personal portfolio showcasing AI/ML and Full Stack projects. Built with HTML, CSS, and vanilla JavaScript, enhanced with GSAP and Lenis.

🔗 **Live:** [bhupeshchauhan.in](https://bhupeshchauhan.in)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5, semantic elements |
| Styling | CSS3, custom properties, modular architecture |
| JavaScript | Vanilla ES6+, no frameworks |
| Animation | [GSAP 3.12](https://greensock.com/gsap/) + ScrollTrigger |
| Smooth Scroll | [Lenis 1.0](https://github.com/studio-freight/lenis) |
| Icons | [Remix Icon 3.5](https://remixicon.com/) |
| Fonts | Inter, Syne, Space Grotesk (Google Fonts) |
| Forms | [FormSubmit](https://formsubmit.co/) (email forwarding) |

---

## Folder Structure

```
├── index.html                  # Main portfolio
├── 404.html                    # Custom 404 page
├── assets/
│   ├── certificates/           # Certificate images
│   ├── images/                 # Profile pic, project covers
│   └── resume/                 # Resume PDF
├── css/
│   ├── variables.css           # Design tokens, theme colors
│   ├── reset.css               # Base reset, accessibility
│   ├── typography.css          # Type scale
│   ├── layout.css              # Grid, flex, spacing
│   ├── components.css          # All UI components
│   ├── animations.css          # Scroll reveals, keyframes
│   └── responsive.css          # Breakpoints (1100px, 767px)
├── js/
│   ├── app.js                  # Main application logic
│   └── certificatesData.js     # Certificate metadata
├── TollFuel-Pro/               # App landing page + APK
└── DoTrackr/                   # App landing page + APK
```

---

## Features

- **GSAP-powered animations** — ScrollTrigger reveals, hero entrance, count-up stats
- **Lenis smooth scroll** — 60fps scroll with scroll progress indicator
- **Dark/Light theme** — persisted in localStorage
- **Project filtering** — All, App, MERN, AI/ML, JavaScript, Java
- **Certificate filtering** — Hackathons, AI, Cloud, Coding, Courses
- **Modal system** — project and certificate detail views
- **Custom cursor** — GPU-accelerated, desktop only (>1024px)
- **Magnetic hover** — social links follow cursor with elastic return
- **Typing animation** — rotating role titles in hero
- **Contact form** — AJAX submission via FormSubmit, honeypot spam protection
- **XSS protection** — all dynamic content HTML-escaped
- **Accessible** — ARIA labels, focus-visible, skip-nav, reduced-motion support
- **SEO** — JSON-LD structured data, Open Graph, canonical URL
- **Performance** — deferred icon fonts, `content-visibility`, `fetchpriority`, `dns-prefetch`

---

## Projects

| # | Project | Stack | Live |
|---|---------|-------|------|
| 1 | TollFuel Pro | Java, Android | [Landing Page](https://bhupeshchauhan.in/TollFuel-Pro/) |
| 2 | DoTrackr | Flutter, Dart, Hive | [Landing Page](https://bhupeshchauhan.in/DoTrackr/) |
| 3 | Syncora | Next.js, NestJS, PostgreSQL, WebRTC | [syncora.bhupeshchauhan.in](https://syncora.bhupeshchauhan.in) |
| 4 | NutriSeva | MERN, ML (Scikit-learn) | [nutriseva.bhupeshchauhan.in](https://nutriseva.bhupeshchauhan.in) |
| 5 | Skylook | JavaScript, Weather API | [skylook.netlify.app](https://skylook.netlify.app/) |
| 6 | ChauhanQuant | AI, Financial Analytics | [chauhanquant.bhupeshchauhan.in](https://chauhanquant.bhupeshchauhan.in) |

---

## Run Locally

```bash
# Any static server works
npx serve .

# Or use VS Code Live Server extension
```

---

## Deployment

Works on any static hosting — GitHub Pages, Netlify, Vercel, Cloudflare Pages.

---

## Libraries Used

- **[GSAP](https://greensock.com/gsap/)** — Animation engine for scroll reveals, hero entrance, and count-up effects
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** — GSAP plugin for scroll-based animation triggers
- **[Lenis](https://github.com/studio-freight/lenis)** — Smooth scroll library with configurable easing
- **[Remix Icon](https://remixicon.com/)** — Icon font for UI icons
- **[FormSubmit](https://formsubmit.co/)** — Zero-backend form submission service
- **[Google Fonts](https://fonts.google.com/)** — Inter, Syne, Space Grotesk typefaces

---

## License

All rights reserved.
