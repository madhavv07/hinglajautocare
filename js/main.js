/**
 * HINGLAJ AUTO CARE — PRODUCTION JAVASCRIPT
 * Vanilla, zero-dependency, accessible, clean agency script.
 */

// Suppress automatic browser "Install app / Add to Home screen" banner on mobile
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  return false;
});

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. STICKY HEADER BORDER ON SCROLL
     -------------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. SUBTLE SECTION FADE-UP (IntersectionObserver)
     -------------------------------------------------------------------------- */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.fade-up').forEach((el) => {
      fadeObserver.observe(el);
    });
  } else {
    // If reduced motion is preferred or observer not supported, show immediately
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.classList.add('in-view');
    });
  }

  /* --------------------------------------------------------------------------
     4. HERO GENTLE PARALLAX (Desktop only, max 40px)
     -------------------------------------------------------------------------- */
  const heroBgImage = document.getElementById('heroBgImage');
  if (heroBgImage && !prefersReducedMotion) {
    const handleParallax = () => {
      if (window.innerWidth >= 992) {
        const scrollY = window.scrollY;
        if (scrollY < 800) {
          const offset = Math.min(scrollY * 0.12, 40);
          heroBgImage.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      } else {
        heroBgImage.style.transform = 'none';
      }
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    window.addEventListener('resize', handleParallax);
  }

  /* --------------------------------------------------------------------------
     5. FAQ ACCORDION (Clean Toggle)
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        // Toggle current
        item.classList.toggle('active', !isActive);
        trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    }
  });

  /* --------------------------------------------------------------------------
     6. GALLERY LIGHTBOX
     -------------------------------------------------------------------------- */
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const badge = item.querySelector('.gallery-overlay-badge');
        if (img) {
          lightboxImg.src = img.currentSrc || img.src;
          lightboxImg.alt = img.alt || 'Hinglaj Auto Care Workshop Photo';
          if (lightboxCaption && badge) {
            lightboxCaption.textContent = badge.textContent.trim();
          }
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. PRESELECT SERVICE DROPDOWN FROM SERVICE CARDS
     -------------------------------------------------------------------------- */
  window.selectServiceAndScroll = function(serviceName) {
    const serviceSelect = document.getElementById('serviceSelect');
    const contactSection = document.getElementById('contact');
    if (serviceSelect) {
      serviceSelect.value = serviceName;
    }
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* --------------------------------------------------------------------------
     8. CONTACT / BOOKING FORM -> DIRECT WHATSAPP DISPATCHER
     -------------------------------------------------------------------------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const car = document.getElementById('custCar').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const notes = document.getElementById('custNotes').value.trim() || 'No additional notes provided.';

      if (!name || !phone || !car || !service) {
        alert('Please fill in your name, phone number, car model, and select a service.');
        return;
      }

      // Clean WhatsApp message formatting
      const text = 
`Hello Hinglaj Auto Care,

I would like to inquire about car repair / maintenance in Ahmedabad.

Details:
• Name: ${name}
• Phone: ${phone}
• Car Model: ${car}
• Service Needed: ${service}
• Notes / Issue: ${notes}

Please provide an estimate and available slot. Thank you.`;

      const targetPhone = '919426024517';
      const encoded = encodeURIComponent(text);
      const url = `https://wa.me/${targetPhone}?text=${encoded}`;

      window.open(url, '_blank');
    });
  }
});
