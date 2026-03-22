# Bhupesh Chauhan Portfolio

A modern personal portfolio website built with HTML, CSS, and vanilla JavaScript.

## Overview

This project is a single-page portfolio with:

- Animated hero and marquee sections
- Dynamic projects and certificates rendered from JavaScript data
- Real-time subcategory filtering for Certificates
- Reusable modal system for project and certificate details
- Theme toggle (light/dark) with localStorage persistence
- Smooth scrolling and precise section reveal animations
- Fully responsive and pixel-perfect layouts for desktop, tablet, and mobile browsers

## Contact Info

Feel free to reach out for collaborations or inquiries:

- **Phone**: [+91 70176 26186](tel:+917017626186)
- **Email**: [support@bhupeshchauhan.in](mailto:support@bhupeshchauhan.in)

## Tech Stack

- HTML5
- CSS3 (modular stylesheets)
- Vanilla JavaScript
- GSAP + ScrollTrigger
- Lenis (smooth scrolling)

## Performance Optimizations

To maintain 60 FPS and high-fidelity interaction, several aggressive optimizations were implemented:
-   **Word-Based Reveals**: Screen reveal animations stagger node vectors by words (`.word-span`) instead of absolute characters, fully eliminating scroll-trigger delays on large titles.
-   **GPU-Compositor Acceleration**: Heavy coordinate animations (Custom Cursor coordinate follower, Marquee loops) use direct translation buffers (`translate3d`) bypassing layout repaint frames.
-   **Initialization Order Pipeline**: Standardizes IntersectionObserver triggers accurately enabling asynchronous JS-rendered grid arrays layout fluid transitions correctly.
-   **Zero-Jank Grid Rendering**: Avoids `content-visibility: auto` on heavy image grids (like Certificates) to prevent brutal main-thread blocking and frame drops when scrolling up/down.
-   **Static Rendering Fallbacks**: Safely unobserves or removes `will-change: transform` from large batches of components after they load to prevent infinite GPU layer memory leaks.

## Project Structure

```text
.
|-- index.html
|-- 404.html
|-- README.md
|-- assets/
|   |-- certificates/
|   |-- images/
|   `-- resume/
|-- css/
|   |-- animations.css
|   |-- components.css
|   |-- layout.css
|   |-- reset.css
|   |-- responsive.css
|   |-- typography.css
|   `-- variables.css
`-- js/
	|-- app.js
	`-- certificatesData.js
```

## Run Locally

Because this is a static website, you can run it directly or with a lightweight local server.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Use VS Code Live Server (recommended)

1. Open the folder in VS Code
2. Start Live Server from `index.html`
3. Visit the served local URL

## Configuration

### Update project cards

Edit `projectData` in `js/app.js`.

Each project supports:

- `title`
- `desc`
- `tags`
- `icon`
- `image`
- `imageClass`
- `imageBoxClass`
- `imageBg`
- `github`
- `live`
- `status`

### Update certificates

Edit `CertificatesData` in `js/certificatesData.js`.

Each certificate supports:
- `title`
- `provider`
- `date`
- `image`
- `tags` (Array)
- `category` (For subcategory tab filtering)

### Update personal details

Edit static content (hero/about/contact/navigation) in `index.html`.

### Configure contact email

Contact form submissions are sent via FormSubmit to `support@bhupeshchauhan.in`.
If needed, update the form endpoint in `index.html`.

## Current UX Notes

- Achievements section is intentionally hidden for future use.
- Project cards are fully clickable (mouse + keyboard).
- Project and certificate details share a unified modal layout.
- Panoramic logo cards support per-project media backgrounds.

## Deployment

You can deploy this site on any static hosting provider:

- GitHub Pages
- Netlify
- Vercel (static)

## License

This project is for personal portfolio use.