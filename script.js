/* ═══════════════════════════════════════════════════════════════════════════
   WEBSITE PESANTREN & SEKOLAH MINNATUL HUDA
   JavaScript Utama - Mobile Nav, Slider, Lightbox, Smooth Scroll
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ───────────────────────────────────────────────────────────────────────────
     CONFIGURATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  const CONFIG = {
    // Banner Slider Settings
    slider: {
      autoplayInterval: 5000, // ms
      pauseOnHover: true,
      pauseOnFocus: true,
      // Gambar banner - UBAH URL DI SINI untuk mengganti gambar slider
      images: [
        {
          src: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg?_gl=1*eqz55w*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM0MjUkajMzJGwwJGgw',
          alt: 'Banner 1 - Pesantren Minnatul Huda',
          title: 'Selamat Datang di Minnatul Huda',
          description: 'Pendidikan Islami Berkualitas dengan Akhlak Mulia'
        },
        {
          src: 'https://images.pexels.com/photos/8164742/pexels-photo-8164742.jpeg?_gl=1*1qgqr66*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM1ODckajI1JGwwJGgw',
          alt: 'Banner 2 - Pendidikan Berkualitas',
          title: 'Pendidikan Berkualitas',
          description: 'Memadukan Kurikulum Pesantren dan Formal'
        },
        {
          src: 'https://images.pexels.com/photos/683833/pexels-photo-683833.jpeg?_gl=1*yjkhrl*_ga*MzQ3NTcyOTc2LjE3NjI2MjMzMzk.*_ga_8JE65Q40S6*czE3NjI2MjMzMzgkbzEkZzEkdDE3NjI2MjM2MzkkajM4JGwwJGgw',
          alt: 'Banner 3 - Fasilitas Modern',
          title: 'Fasilitas Modern',
          description: 'Lingkungan Belajar yang Nyaman dan Kondusif'
        }
      ]
    },
    
    // External Login URL - UBAH DI SINI untuk mengganti link login
    loginUrl: 'https://login.pesantrenminnatulhuda.com',
    
    // Smooth scroll offset (untuk header sticky)
    scrollOffset: 80
  };

  /* ───────────────────────────────────────────────────────────────────────────
     MOBILE NAVIGATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.mobile-overlay');
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    
    if (!toggleBtn || !nav) return;
    
    // Toggle mobile menu
    function toggleMenu() {
      const isActive = nav.classList.contains('active');
      nav.classList.toggle('active');
      overlay?.classList.toggle('active');
      
      // Update ARIA attributes
      toggleBtn.setAttribute('aria-expanded', !isActive);
      
      // Trap focus when menu is open
      if (!isActive) {
        nav.querySelector('a')?.focus();
      }
    }
    
    // Close mobile menu
    function closeMenu() {
      nav.classList.remove('active');
      overlay?.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle button click
    toggleBtn.addEventListener('click', toggleMenu);
    
    // Overlay click (close menu)
    overlay?.addEventListener('click', closeMenu);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
        toggleBtn.focus();
      }
    });
    
    // Mobile dropdown toggles
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;
      
      toggle.addEventListener('click', (e) => {
        // On mobile, prevent immediate navigation for dropdown items
        if (window.innerWidth <= 768 && dropdown.querySelector('.dropdown-menu')) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          
          // Update ARIA
          const isExpanded = dropdown.classList.contains('active');
          toggle.setAttribute('aria-expanded', isExpanded);
        }
      });
    });
    
    // Close menu when clicking nav links (on mobile)
    const navLinks = nav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     HERO BANNER SLIDER
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.slider-track');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const pagination = slider.querySelector('.slider-pagination');
    
    if (!track) return;
    
    let currentSlide = 0;
    let autoplayTimer = null;
    let isPlaying = true;
    const totalSlides = CONFIG.slider.images.length;
    
    // Create slides dynamically from config
    track.innerHTML = CONFIG.slider.images.map((img, index) => `
      <div class="slider-slide">
        <img src="${img.src}" alt="${img.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">
        <div class="slider-content">
          <h2>${img.title}</h2>
          <p>${img.description}</p>
        </div>
      </div>
    `).join('');
    
    // Create pagination dots
    if (pagination) {
      pagination.innerHTML = CONFIG.slider.images.map((_, index) => `
        <button 
          class="slider-dot ${index === 0 ? 'active' : ''}" 
          aria-label="Slide ${index + 1}"
          data-slide="${index}"
        ></button>
      `).join('');
    }
    
    // Go to specific slide
    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update pagination
      const dots = pagination?.querySelectorAll('.slider-dot');
      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
      
      // Update ARIA live region for screen readers
      const liveRegion = slider.querySelector('[aria-live]');
      if (liveRegion) {
        liveRegion.textContent = `Slide ${currentSlide + 1} of ${totalSlides}: ${CONFIG.slider.images[currentSlide].title}`;
      }
    }
    
    // Next slide
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Start autoplay
    function startAutoplay() {
      if (!isPlaying) return;
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, CONFIG.slider.autoplayInterval);
    }
    
    // Stop autoplay
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
    
    // Button event listeners
    prevBtn?.addEventListener('click', () => {
      prevSlide();
      stopAutoplay();
      isPlaying = false;
    });
    
    nextBtn?.addEventListener('click', () => {
      nextSlide();
      stopAutoplay();
      isPlaying = false;
    });
    
    // Pagination dots
    pagination?.addEventListener('click', (e) => {
      if (e.target.classList.contains('slider-dot')) {
        const slideIndex = parseInt(e.target.dataset.slide);
        goToSlide(slideIndex);
        stopAutoplay();
        isPlaying = false;
      }
    });
    
    // Pause on hover
    if (CONFIG.slider.pauseOnHover) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoplay();
      });
    }
    
    // Pause on focus
    if (CONFIG.slider.pauseOnFocus) {
      const focusableElements = slider.querySelectorAll('button, a');
      focusableElements.forEach(el => {
        el.addEventListener('focus', stopAutoplay);
        el.addEventListener('blur', () => {
          if (isPlaying && !slider.matches(':hover')) {
            startAutoplay();
          }
        });
      });
    }
    
    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
        isPlaying = false;
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
        isPlaying = false;
      }
    });
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (isPlaying) {
        startAutoplay();
      }
    });
    
    // Add ARIA live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    slider.appendChild(liveRegion);
    
    // Start autoplay
    startAutoplay();
  }

  /* ───────────────────────────────────────────────────────────────────────────
     SMOOTH SCROLL TO ANCHORS
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initSmoothScroll() {
    // Handle all anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Focus target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
      
      // Update URL
      history.pushState(null, '', href);
    });
    
    // Scroll to anchor on page load
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      }, 100);
    }
  }

  /* ───────────────────────────────────────────────────────────────────────────
     GALLERY LIGHTBOX
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="" alt="">
        <button class="lightbox-close" aria-label="Close lightbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Open lightbox
    function openLightbox(imgSrc, imgAlt) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    
    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
    
    // Gallery item clicks
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src, img.alt);
        }
      });
      
      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const img = item.querySelector('img');
          if (img) {
            openLightbox(img.src, img.alt);
          }
        }
      });
    });
    
    // Close button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     ACCORDION (FAQ)
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isActive = item.classList.contains('active');
        
        // Close all items (optional: remove these 3 lines for multiple-open accordion)
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
        
        // Update ARIA
        header.setAttribute('aria-expanded', !isActive);
      });
      
      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────────────────
     DATA PARSER HELPER
     ─────────────────────────────────────────────────────────────────────────── */
  
  // Helper function to parse JSON from script blocks
  // Gunakan fungsi ini untuk membaca data dari <script type="application/json" id="...">
  window.parseDataBlock = function(elementId) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Data block with id "${elementId}" not found`);
        return null;
      }
      return JSON.parse(element.textContent);
    } catch (error) {
      console.error(`Error parsing data block "${elementId}":`, error);
      return null;
    }
  };

  /* ───────────────────────────────────────────────────────────────────────────
     EXTERNAL LOGIN LINK
     ─────────────────────────────────────────────────────────────────────────── */
  
  function initLoginLink() {
    const loginLink = document.querySelector('.nav-link.external');
    if (loginLink && CONFIG.loginUrl) {
      loginLink.href = CONFIG.loginUrl;
      loginLink.target = '_blank';
      loginLink.rel = 'noopener noreferrer';
    }
  }

  /* ───────────────────────────────────────────────────────────────────────────
     INITIALIZATION
     ─────────────────────────────────────────────────────────────────────────── */
  
  // Initialize all modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    loadSiteData();
    initMobileNav();
    initSlider();
    initSmoothScroll();
    initLightbox();
    initAccordion();
    initLoginLink();
    
    console.log('✅ Website Minnatul Huda initialized successfully');
  }
  
})();
  /* ───────────────────────────────────────────────────────────────────────────
     UNIVERSAL IMAGE LIGHTBOX (tanpa tombol close)
     ─────────────────────────────────────────────────────────────────────────── */
  function initUniversalImageZoom() {
    // Buat elemen lightbox hanya sekali
    let lightbox = document.querySelector('.lightbox-universal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox lightbox-universal';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="" alt="">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');

    // Fungsi buka & tutup lightbox
    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    // Tutup dengan klik di luar gambar atau tekan ESC
    lightbox.addEventListener('click', (e) => {
      // Jika klik bukan pada gambar → tutup
      if (e.target === lightbox || e.target.closest('.lightbox-content') === null) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Gunakan event delegation agar semua gambar di halaman aktif
    document.body.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;

      // Abaikan gambar kecil seperti logo/ikon
      const rect = img.getBoundingClientRect();
      if (rect.width < 100 && rect.height < 100) return;

      // Abaikan gambar di dalam galeri khusus
      if (img.closest('.gallery-item')) return;

      openLightbox(img.src, img.alt);
    });
  }

  // Pastikan dipanggil di dalam init()

window.siteData = null;

function loadSiteData() {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      window.siteData = data;
      if (document.getElementById('stats-container')) initStatistics(data.statistics);
      if (document.getElementById('programs-container')) initPrograms(data.programs);
      if (document.getElementById('news-container')) initNews(data.news);
      if (document.getElementById('gallery-container')) initGallery(data.gallery);
      if (document.getElementById('testimonial-container')) initTestimonials(data.testimonials);
      if (document.getElementById('testimonial-form')) initTelegramForm(data.forms.telegram);
    })
    .catch(err => console.error('Error loading data.json:', err));
}

function initStatistics(stats) {
  const container = document.getElementById('stats-container');
  if (!container || !stats) return;
  
  const statsItems = [
    { label: 'Total Santri', value: stats.total_students || 0, icon: '👥' },
    { label: 'Alumni', value: stats.total_alumni || 0, icon: '🎓' },
    { label: 'Guru & Ustadz', value: stats.total_teachers || 0, icon: '👨‍🏫' },
    { label: 'Prestasi', value: stats.achievements || 0, icon: '🏆' }
  ];
  
  container.innerHTML = statsItems.map(item => `
    <div class="stat-card card" style="text-align: center; padding: 2rem;">
      <div style="font-size: 3rem;">${item.icon}</div>
      <div class="stat-value" data-target="${item.value}" style="font-size: 2.5rem; font-weight: bold; color: var(--primary); margin: 0.5rem 0;">0</div>
      <div style="font-size: 1rem; color: var(--text-muted);">${item.label}</div>
    </div>
  `).join('');
  
  setTimeout(animateCounters, 200);
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString('id-ID');
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current).toLocaleString('id-ID');
      }
    }, 16);
  });
}

function initPrograms(programs) {
  const container = document.getElementById('programs-container');
  if (!container || !programs) return;
  
  container.innerHTML = programs.map(program => `
    <div class="card program-card" style="cursor: pointer;" data-program-id="${program.id}">
      <img src="${program.images[0]}" alt="${program.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
      <div class="card-content">
        <h3 class="card-title">${program.title}</h3>
        <p class="card-text">${program.description.substring(0, 100)}...</p>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('click', () => {
      const programId = card.dataset.programId;
      showProgramPopup(programs.find(p => p.id == programId));
    });
  });
}

function showProgramPopup(program) {
  if (!program) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.styles.jsText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s ease;';
  
  let currentImageIndex = 0;
  let autoSlideInterval;
  
  const updateSlider = () => {
    const sliderImg = modal.querySelector('.modal-slider-img');
    const indicators = modal.querySelectorAll('.slider-indicator');
    if (sliderImg) {
      sliderImg.src = program.images[currentImageIndex];
      indicators.forEach((ind, i) => {
        ind.style.background = i === currentImageIndex ? 'var(--primary)' : 'rgba(255,255,255,0.5)';
      });
    }
  };
  
  const nextSlide = () => {
    currentImageIndex = (currentImageIndex + 1) % program.images.length;
    updateSlider();
  };
  
  const prevSlide = () => {
    currentImageIndex = (currentImageIndex - 1 + program.images.length) % program.images.length;
    updateSlider();
  };
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: var(--radius-xl); padding: 0; max-width: 900px; max-height: 90vh; overflow-y: auto; position: relative; scrollbar-width: none; -ms-overflow-style: none;">
      <style>
        .modal-content::-webkit-scrollbar { display: none; }
      </style>
      <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10;">&times;</button>
      
      <div style="position: relative; width: 100%; height: 400px; background: #000; border-radius: var(--radius-xl) var(--radius-xl) 0 0;">
        <img src="${program.images[0]}" alt="${program.title}" class="modal-slider-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0;">
        ${program.images.length > 1 ? `
          <button class="slider-prev-btn" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">&lsaquo;</button>
          <button class="slider-next-btn" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">&rsaquo;</button>
          <div style="position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem;">
            ${program.images.map((_, i) => `<div class="slider-indicator" style="width: 10px; height: 10px; border-radius: 50%; background: ${i === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.5)'}; cursor: pointer;" data-index="${i}"></div>`).join('')}
          </div>
        ` : ''}
      </div>
      
      <div style="padding: 2rem;">
        <h2 style="color: var(--primary); margin-bottom: 1rem;">${program.title}</h2>
        <p style="margin-bottom: 1.5rem; line-height: 1.6; color: var(--text-muted);">${program.description}</p>
        
        ${program.youtube ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--primary); margin-bottom: 0.75rem; font-size: 1.1rem;">Video Program</h3>
            <iframe width="100%" height="315" src="${program.youtube}" frameborder="0" allowfullscreen style="border-radius: var(--radius-md);"></iframe>
          </div>
        ` : ''}
        
        <h3 style="color: var(--primary); margin-bottom: 0.75rem; font-size: 1.1rem;">Fitur Program:</h3>
        <ul style="line-height: 1.8; padding-left: 1.5rem;">
          ${program.features.map(f => `<li style="margin-bottom: 0.5rem;">${f}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
  
  if (program.images.length > 1) {
    autoSlideInterval = setInterval(nextSlide, 4000);
    
    modal.querySelector('.slider-prev-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoSlideInterval);
      prevSlide();
      autoSlideInterval = setInterval(nextSlide, 4000);
    });
    
    modal.querySelector('.slider-next-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoSlideInterval);
      nextSlide();
      autoSlideInterval = setInterval(nextSlide, 4000);
    });
    
    modal.querySelectorAll('.slider-indicator').forEach((ind, i) => {
      ind.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(autoSlideInterval);
        currentImageIndex = i;
        updateSlider();
        autoSlideInterval = setInterval(nextSlide, 4000);
      });
    });
  }
  
  const closeModal = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initNews(news) {
  const container = document.getElementById('news-container');
  if (!container || !news) return;
  
  container.innerHTML = news.slice(0, 3).map(item => `
    <div class="card news-card" style="cursor: pointer;" data-news-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
      <div class="card-content">
        <span style="display: inline-block; background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.875rem; margin-bottom: 0.5rem;">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-text">${item.excerpt}</p>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">${new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const newsId = card.dataset.newsId;
      showNewsPopup(news.find(n => n.id == newsId));
    });
  });
}

function showNewsPopup(newsItem) {
  if (!newsItem) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.styles.jsText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s ease;';
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: var(--radius-xl); padding: 0; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; scrollbar-width: none; -ms-overflow-style: none;">
      <style>
        .modal-content::-webkit-scrollbar { display: none; }
      </style>
      <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10;">&times;</button>
      
      <img src="${newsItem.image}" alt="${newsItem.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0;">
      
      <div style="padding: 2rem;">
        <span style="display: inline-block; background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.875rem; margin-bottom: 1rem;">${newsItem.category}</span>
        <h2 style="color: var(--primary); margin-bottom: 0.5rem;">${newsItem.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">${new Date(newsItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <div style="line-height: 1.8; color: var(--text);">${newsItem.content}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
  
  const closeModal = () => {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initGallery(gallery) {
  const container = document.getElementById('gallery-container');
  if (!container || !gallery || !gallery.photos) return;
  
  container.styles.jsText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;';
  container.innerHTML = gallery.photos.map(photo => `
    <div class="gallery-item" style="position: relative; overflow: hidden; border-radius: var(--radius-lg); cursor: pointer;" data-image="${photo.image}" data-title="${photo.title}" data-description="${photo.description}">
      <img src="${photo.image}" alt="${photo.title}" class="gallery-img" style="width: 100%; height: 250px; object-fit: cover; transition: transform 0.3s;">
      <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); color: white; padding: 1rem; opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <h4 style="margin: 0 0 0.5rem 0; color: #FFFFFF; font-size: 1.1rem;">${photo.title}</h4>
        <p style="margin: 0; font-size: 0.875rem; color: #FFFFFF;">${photo.description}</p>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.gallery-overlay').style.opacity = '1';
      item.querySelector('.gallery-img').style.transform = 'scale(1.1)';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.gallery-overlay').style.opacity = '0';
      item.querySelector('.gallery-img').style.transform = 'scale(1)';
    });
    item.addEventListener('click', () => {
      openImageLightbox(item.dataset.image, item.dataset.title, item.dataset.description);
    });
  });
}

function openImageLightbox(src, title, description) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox active';
  lightbox.styles.jsText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s ease;';
  lightbox.innerHTML = `
    <div class="lightbox-content" style="position: relative; max-width: 90%; max-height: 90%; text-align: center;">
      <button class="lightbox-close" style="position: absolute; top: -3rem; right: 0; background: white; color: black; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10;">&times;</button>
      <img src="${src}" alt="${title}" style="width: 100%; max-width: 1200px; aspect-ratio: 16/9; object-fit: cover; border-radius: var(--radius-lg); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
      <div style="background: rgba(0,0,0,0.8); color: white; padding: 1rem; margin-top: 1rem; border-radius: var(--radius-md); max-width: 1200px; margin-left: auto; margin-right: auto;">
        <h3 style="margin: 0 0 0.5rem 0; color: #FFFFFF;">${title}</h3>
        <p style="margin: 0; color: #FFFFFF;">${description}</p>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);
  setTimeout(() => lightbox.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
  
  const closeLightbox = () => {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.remove();
      document.body.style.overflow = '';
    }, 300);
  };
  
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function initTestimonials(testimonials) {
  const container = document.getElementById('testimonial-container');
  if (!container || !testimonials) return;
  
  if (testimonials.length === 0) return;
  
  let currentIndex = 0;
  let autoSlideInterval;
  
  const isMobile = window.innerWidth <= 768;
  const itemsPerView = isMobile ? 2 : 3;
  
  const renderTestimonials = () => {
    const visibleTestimonials = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visibleTestimonials.push(testimonials[index]);
    }
    
    container.styles.jsText = `display: grid; grid-template-columns: repeat(${itemsPerView}, 1fr); gap: 1.5rem; margin-bottom: 2rem; transition: opacity 0.3s ease;`;
    
    container.innerHTML = visibleTestimonials.map(testi => `
      <div class="testimonial-card card" style="text-align: center; padding: 2rem;">
        <img src="${testi.photo}" alt="${testi.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 3px solid var(--primary-soft);">
        <h4 style="margin: 0 0 0.25rem 0; color: var(--primary); font-weight: 600;">${testi.name}</h4>
        <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: var(--text-muted);">${testi.role}</p>
        <div style="color: #FFB800; margin-bottom: 1rem; font-size: 1.2rem;">${'⭐'.repeat(Math.floor(testi.rating))}</div>
        <p style="font-style: italic; line-height: 1.6; margin-bottom: 0.75rem; color: var(--text);">"${testi.comment}"</p>
        <p style="font-size: 0.875rem; color: var(--text-muted);">${new Date(testi.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    `).join('');
  };
  
  const nextSlide = () => {
    container.style.opacity = '0.5';
    setTimeout(() => {
      currentIndex = (currentIndex + itemsPerView) % testimonials.length;
      renderTestimonials();
      container.style.opacity = '1';
    }, 300);
  };
  
  const prevSlide = () => {
    container.style.opacity = '0.5';
    setTimeout(() => {
      currentIndex = (currentIndex - itemsPerView + testimonials.length) % testimonials.length;
      renderTestimonials();
      container.style.opacity = '1';
    }, 300);
  };
  
  renderTestimonials();
  
  if (testimonials.length > itemsPerView) {
    const controlsDiv = document.createElement('div');
    controlsDiv.styles.jsText = 'display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem;';
    controlsDiv.innerHTML = `
      <button class="testi-prev" style="background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s;">&lsaquo;</button>
      <div style="display: flex; gap: 0.5rem;">
        ${testimonials.map((_, i) => `<div class="testi-dot" data-index="${i}" style="width: 10px; height: 10px; border-radius: 50%; background: ${i === currentIndex ? 'var(--primary)' : 'var(--neutral-300)'}; cursor: pointer; transition: all 0.3s;"></div>`).join('')}
      </div>
      <button class="testi-next" style="background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s;">&rsaquo;</button>
    `;
    container.parentElement.appendChild(controlsDiv);
    
    controlsDiv.querySelector('.testi-prev').addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      prevSlide();
      autoSlideInterval = setInterval(nextSlide, 6000);
    });
    
    controlsDiv.querySelector('.testi-next').addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      nextSlide();
      autoSlideInterval = setInterval(nextSlide, 6000);
    });
    
    controlsDiv.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        container.style.opacity = '0.5';
        setTimeout(() => {
          currentIndex = i;
          renderTestimonials();
          container.style.opacity = '1';
          controlsDiv.querySelectorAll('.testi-dot').forEach((d, idx) => {
            d.style.background = idx === i ? 'var(--primary)' : 'var(--neutral-300)';
          });
        }, 300);
        autoSlideInterval = setInterval(nextSlide, 6000);
      });
    });
    
    autoSlideInterval = setInterval(nextSlide, 6000);
  }
  
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      location.reload();
    }
  });
}

function initTelegramForm(telegramConfig) {
  const form = document.getElementById('testimonial-form');
  if (!form || !telegramConfig) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const message = `🌟 *Testimoni Baru dari Website*\n\n👤 *Nama:* ${data.name}\n📋 *Status:* ${data.role}\n⭐ *Rating:* ${data.rating}/5\n\n💬 *Testimoni:*\n${data.comment}`;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      if (response.ok) {
        alert('✅ Terima kasih! Testimoni Anda berhasil dikirim.');
        form.reset();
      } else {
        alert('❌ Maaf, terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error sending to Telegram:', err);
      alert('❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteData);
} else {
  loadSiteData();
}
