# Minnatul Huda Website

## Overview

This is a static website for Pesantren & Sekolah Minnatul Huda, an Islamic boarding school and educational institution. The website showcases the institution's profile, educational units, achievements, galleries, and registration information. It features a modern, futuristic design with a green color scheme (#0B6E4F primary, #14A76C accent) and includes interactive enhancements like glossy hover effects, scroll reveal animations, and a universal lightbox for images.

The site is built as a static HTML/CSS/JavaScript application with no backend dependencies, making it ideal for deployment on static hosting platforms or GitHub Pages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML5 with semantic markup for accessibility
- Vanilla CSS3 with CSS Custom Properties (CSS Variables) for theming
- Vanilla JavaScript (ES6+) with no external dependencies
- Responsive design using CSS Grid and Flexbox

**File Organization:**
- **HTML Pages**: Multiple page types including home (beranda.html/index.html), about (tentang.html), unit pages (unit-*.html), achievement pages (prestasi-*.html), gallery pages (galeri-*.html), and registration pages (daftar-*.html)
- **Core Stylesheets**: 
  - `styles.css` - Main stylesheet (marked as DO NOT MODIFY)
  - `enhancers.css` - Enhancement styles for modern interactive features
- **JavaScript Files**:
  - `script.js` - Core functionality (marked as DO NOT MODIFY)
  - `enhancers.js` - Interactive enhancements (lightbox, scroll reveal, progress bar)
- **Data File**: `data.json` - Contains dynamic content including site settings, slider images, team information, and other configurable data

**Design System:**
- Green futuristic theme with precise color requirements
- CSS Custom Properties for consistent theming
- Glossy/glassy effects on interactive elements
- Scroll-triggered reveal animations for content sections
- Accessible navigation with ARIA labels and skip links

**Key Interactive Features:**
1. **Mobile Navigation**: Responsive hamburger menu with overlay
2. **Image Slider**: Auto-rotating banner with configurable images from data.json
3. **Universal Lightbox**: Click-to-expand functionality for all images with keyboard navigation
4. **Scroll Reveal**: Elements animate into view as users scroll
5. **Scroll Progress Bar**: Visual indicator of page scroll position
6. **Glossy Hover Effects**: Interactive sheen effects on cards and buttons

### Data Management

**JSON-Driven Content:**
The application uses `data.json` as a single source of truth for:
- Site-wide settings (login URL, contact information, site name/description)
- Banner slider images with titles and descriptions
- Team member profiles
- Other dynamic content elements

**Data Flow:**
- JavaScript fetches and parses data.json on page load
- Content is dynamically injected into HTML elements
- No build process required - data updates are immediately reflected

### Page Architecture

**Common Structure:**
All pages follow a consistent structure:
1. Skip-to-content link for accessibility
2. Mobile overlay for navigation
3. Fixed header with logo and navigation
4. Main content area with semantic sections
5. Footer with contact information and quick links

**Navigation System:**
- Dropdown menus for hierarchical content (Tentang, Prestasi, Unit, Galeri, Pendaftaran)
- Active state tracking for current page
- Mobile-responsive with toggle functionality

**Page Categories:**
1. **Information Pages**: Beranda, Tentang (with anchor-linked sections)
2. **Unit Pages**: Showcase different educational divisions (Yayasan/Ponpes, SD IT, SMP BP, SMK)
3. **Achievement Pages**: Display student and institutional achievements
4. **Gallery Pages**: Image collections for events, facilities, and general photos
5. **Registration Pages**: Information about enrollment, requirements, and fees

### Accessibility Features

- Semantic HTML5 elements (header, nav, main, section, footer)
- ARIA attributes for interactive elements
- Skip-to-content links
- Keyboard navigation support in lightbox
- Proper heading hierarchy
- Alt text for images
- Focus management for modals and dropdowns

### Deployment Architecture

**Static Hosting:**
- No server-side processing required
- All assets are client-side
- Can be hosted on any static hosting service (GitHub Pages, Netlify, Vercel, etc.)
- Python HTTP server for local development (`python3 -m http.server 5000`)

**Build Process:**
- No build step required
- No dependency installation needed
- Direct file serving from repository

## External Dependencies

### Third-Party Services

**External Assets:**
- Favicon hosted on external URLs (imgur.com, vexels.com)
- Placeholder images from placehold.co for team photos and content
- Banner images from Pexels (images.pexels.com)

**External Login Integration:**
- Configured login URL: `https://login.pesantrenminnatulhuda.com`
- Accessible via data.json configuration

### CDN Resources

**None Currently Used:**
The project deliberately uses no external CDN dependencies for CSS frameworks or JavaScript libraries. All functionality is implemented with vanilla JavaScript and CSS.

**Optional Google Fonts:**
The CSS includes commented-out configuration for Google Fonts (Inter and Noto Serif), which can be optionally enabled by uncommenting the CSS variables and adding the appropriate link tag to HTML files.

### Development Tools

**Local Server:**
- Python 3 HTTP server for local development
- npm scripts defined in package.json for convenience
- Live Server extension compatible (VSCode)

**No Database:**
This is a static website with no database requirements. All data is stored in the flat JSON file (data.json).