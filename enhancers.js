/* ═══════════════════════════════════════════════════════════════════════════
   ENHANCERS.JS - Premium Interactive Features
   Pesantren & Sekolah Minnatul Huda
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const CONFIG = {
    scrollThreshold: 100,
    revealThreshold: 0.15,
    tiltMaxRotation: 15,
    transitionDuration: 300,
    lightboxTransition: 400,
  };

  function initStickyNav() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= CONFIG.scrollThreshold) {
        header.classList.add('transparent');
        header.classList.remove('scrolled');
      } else {
        header.classList.remove('transparent');
        header.classList.add('scrolled');
      }

      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });
  }

  function initDynamicMenuHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const hashLinks = Array.from(navLinks).filter(link => {
      const href = link.getAttribute('href');
      return href && href.includes('#');
    });

    if (hashLinks.length === 0) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          hashLinks.forEach(link => {
            const href = link.getAttribute('href');

            if (href && href.startsWith('#') && href === '#' + currentId) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  function initCardTilt() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * CONFIG.tiltMaxRotation;
        const rotateY = ((centerX - x) / centerX) * CONFIG.tiltMaxRotation;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-8px)
          scale(1.01)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
      });
    });
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.card, .section-header, img');

    revealElements.forEach((element, index) => {
      if (!element.classList.contains('reveal') &&
          !element.classList.contains('reveal-left') &&
          !element.classList.contains('reveal-right')) {

        const variant = index % 3;
        if (variant === 0) {
          element.classList.add('reveal-fade');
        } else if (variant === 1) {
          element.classList.add('reveal-left');
        } else {
          element.classList.add('reveal-right');
        }
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.revealThreshold,
      rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(element => {
      observer.observe(element);
    });

    console.log('✅ Scroll reveal animations initialized');
  }

  function initScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress');

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-label', 'Reading progress');
      document.body.appendChild(progressBar);
    }

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    });
  }

  function initUniversalLightbox() {
    let lightbox = document.getElementById('lightbox');
    let currentImageIndex = 0;
    let images = [];

    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image lightbox');
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
          <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&lsaquo;</button>
          <img src="" alt="" class="lightbox-image">
          <button class="lightbox-nav lightbox-next" aria-label="Next image">&rsaquo;</button>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    function collectImages() {
      const galleryImages = document.querySelectorAll('.gallery-item img, .card-image, .slider-slide img, img[src*="placehold"], img[src*="pexels"]');
      images = Array.from(galleryImages).filter(img => {
        return img.src && img.complete && img.naturalHeight !== 0;
      });
    }

    function openLightbox(imageSrc, imageAlt) {
      collectImages();
      currentImageIndex = images.findIndex(img => img.src === imageSrc);
      if (currentImageIndex === -1) currentImageIndex = 0;

      lightboxImage.src = imageSrc;
      lightboxImage.alt = imageAlt || 'Image';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';

      closeBtn.focus();

      if (images.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImage.src = '';
    }

    function showPrevImage(e) {
      if (e) e.stopPropagation();
      if (images.length === 0) return;
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      lightboxImage.src = images[currentImageIndex].src;
      lightboxImage.alt = images[currentImageIndex].alt || 'Image';
    }

    function showNextImage(e) {
      if (e) e.stopPropagation();
      if (images.length === 0) return;
      currentImageIndex = (currentImageIndex + 1) % images.length;
      lightboxImage.src = images[currentImageIndex].src;
      lightboxImage.alt = images[currentImageIndex].alt || 'Image';
    }

    document.addEventListener('click', (e) => {
      const clickedImage = e.target.closest('img');
      if (clickedImage &&
          !clickedImage.closest('.lightbox') &&
          !clickedImage.closest('.logo-icon') &&
          !clickedImage.closest('.hamburger-icon') &&
          clickedImage.src &&
          (clickedImage.src.includes('placehold') || clickedImage.src.includes('pexels') || clickedImage.closest('.gallery-item'))) {
        e.preventDefault();
        openLightbox(clickedImage.src, clickedImage.alt);
      }
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });

    console.log('✅ Universal lightbox initialized');
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#kontak') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  function initFormEnhancements() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.parentElement?.classList.add('focused');
        });

        input.addEventListener('blur', function() {
          if (!this.value) {
            this.parentElement?.classList.remove('focused');
          }
        });

        if (input.value) {
          input.parentElement?.classList.add('focused');
        }
      });
    });
  }

  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const offset = scrolled * speed;
        element.style.transform = `translateY(${offset}px)`;
      });
    });
  }

  function initAll() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    console.log('🚀 Initializing premium enhancements...');

    initStickyNav();
    initDynamicMenuHighlight();
    initCardTilt();
    initScrollReveal();
    initScrollProgress();
    initUniversalLightbox();
    initSmoothScroll();
    initLazyLoading();
    initFormEnhancements();
    initParallax();

    console.log('✅ All premium features initialized successfully!');
    console.log('🌿 Pesantren & Sekolah Minnatul Huda - International Premium Edition');
  }

  initAll();

})();
