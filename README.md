# Plates & Pixels Agency Website

This repository hosts the static website for **Plates & Pixels** (Plates & Pixels Agency), a modern web design agency specializing in fast, SEO-ready, mobile-friendly, and WhatsApp-integrated websites for cafes, restaurants, bars, bakeries, and food businesses.

## Tech Stack & Architecture

* **Frontend**: HTML5, Vanilla CSS (custom design system), Vanilla JavaScript.
* **Hosting & Routing**: Optimized for Netlify, utilizing a custom `_redirects` configuration file to map virtual clean URLs to flat HTML files.
* **Centralized Configuration**: Business details (WhatsApp numbers, email addresses, Instagram handle, and production domain) are managed in one place via `config.js` and dynamically applied to the DOM on load.

## Directory Structure

```text
├── about/                    # About page folder
│   └── index.html
├── blog/                     # Blog section
│   ├── index.html            # Blog hub
│   ├── blog.css              # Custom styling for articles
│   ├── blog.js               # Article reading indicators, dynamic scroll behavior
│   └── [articles].html       # Flat HTML article files (mapped to clean URLs)
├── contact/                  # Contact page folder
│   └── index.html
├── portfolio/                # Portfolio page folder
│   └── index.html
├── pricing/                  # Pricing page folder
│   └── index.html
├── services/                 # Services page folder
│   └── index.html
├── privacy-policy/           # Privacy policy page folder
│   └── index.html
├── terms/                    # Terms of service page folder
│   └── index.html
├── tools/                    # Maintenance & SEO helper scripts
│   ├── check_links.js        # Validates all internal link paths (virtual & physical)
│   ├── fix_absolute_paths.js # normalizes references to root-relative paths
│   ├── fix_articles.js       # Standardizes layouts and classes in articles
│   ├── fix_blog_nav_links.js # Adjusts header blog navigation links
│   ├── fix_domain.js         # Automates domain replacements for SEO migrations
│   └── fix_footer_articles.js# Syncs footers across all blog pages
├── config.js                 # Centralized configuration variables (WhatsApp, email, domain)
├── app.js                    # Global navigation controls & DOM rendering logic
├── sitemap.xml               # Clean canonical XML sitemap
├── robots.txt                # Search crawler instructions
├── _redirects                # Netlify rewrite/redirect configuration
└── index.html                # Homepage
```

## Centralized Configuration

To change contact details or social media links across the entire site, simply modify the `CONFIG` object inside [config.js](file:///c:/hbdcdsdsbcscsssscs/config.js):

```javascript
const CONFIG = {
  businessName: "Plates & Pixels",
  whatsappNumber: "918168246113",
  whatsappNumberFormatted: "+91 81682 46113",
  email: "ajaykumar374011@gmail.com",
  instagramUrl: "https://www.instagram.com/foodbizweb/",
  instagramUsername: "@foodbizweb",
  productionDomain: "https://genuine-kleicha-966907.netlify.app"
};
```

DOM elements with `data-config`, `data-config-link`, or `data-msg-type` attributes will automatically parse and display these values at runtime.

## URL Structure (Netlify Rewrites)

To keep directory structures simple, articles are stored as flat files in `blog/` (e.g., `blog/why-cafe-needs-website.html`). In production, clean canonical URLs are served via Netlify rewrites configured in `_redirects`:

1. Requesting `https://genuine-kleicha-966907.netlify.app/blog/why-every-cafe-needs-a-website/` returns `200 OK` and serves the contents of `blog/why-cafe-needs-website.html` directly.
2. Requesting the physical filename `https://genuine-kleicha-966907.netlify.app/blog/why-cafe-needs-website.html` triggers a `301 Redirect` to the canonical clean URL folder path.

## Utility Scripts

Run these Node.js scripts from the root directory during development or deployment prep:

* **Verify Internal Links**:
  ```bash
  node tools/check_links.js
  ```
  Scans all HTML pages and parses `_redirects` to verify that there are no broken physical or virtual links in the project.

* **Re-Target Domain Settings**:
  ```bash
  node tools/fix_domain.js
  ```
  Modifies canonical links, Open Graph metatags, and JSON-LD structured data block references globally when migrating or changing production domains.
