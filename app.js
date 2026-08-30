/* ============================================================
   PLATES & PIXELS — APP.JS
   Interactions, animations, mobile nav, FAQ accordion
   ============================================================ */

// ─── NAV: Scroll effect + active link ───────────────────────
const nav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav__links a');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── MOBILE NAV ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('nav-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ─── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── INTERSECTION OBSERVER (animations) ─────────────────────
const animatedEls = document.querySelectorAll('.fade-up, .fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatedEls.forEach(el => observer.observe(el));

// ─── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll('.faq-item__q').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });

  // Keyboard support
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      question.click();
    }
  });
});

// ─── DEMO FORM ───────────────────────────────────────────────
const demoForm = document.getElementById('demo-form');
if (demoForm) {
  demoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('demo-name').value.trim();
    const restaurant = document.getElementById('demo-restaurant').value.trim();
    const phone = document.getElementById('demo-phone').value.trim();

    if (!name || !restaurant || !phone) {
      showToast('Please fill in Name, Restaurant Name, and Phone.', '⚠️');
      return;
    }

    const message = encodeURIComponent(
      `Hi! I'd like a free website demo.\n\nName: ${name}\nRestaurant: ${restaurant}\nPhone: ${phone}`
    );
    const waNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : '919999999999';
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    showToast('Redirecting to WhatsApp... we will get back to you soon!', '✅');
    demoForm.reset();
  });
}

// ─── CONTACT FORM ────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const restaurant = document.getElementById('contact-restaurant').value.trim();

    if (!name || !phone || !message) {
      showToast('Please fill in all required fields.', '⚠️');
      return;
    }

    const waMessage = encodeURIComponent(
      `Hi! I am contacting from your website.\n\nName: ${name}\nPhone: ${phone}${restaurant ? '\nRestaurant: ' + restaurant : ''}\n\nMessage: ${message}`
    );
    const waNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : '919999999999';
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
    showToast('Message sent via WhatsApp!', '✅');
    contactForm.reset();
  });
}

// ─── TOAST NOTIFICATION ─────────────────────────────────────
function showToast(message, icon = '✅') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── LAZY LOAD IMAGES ────────────────────────────────────────
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
} else {
  // Fallback for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ─── PORTFOLIO CARD HOVER (keyboard) ─────────────────────────
document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.portfolio-card__overlay').style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.portfolio-card__overlay').style.opacity = '0';
  });
});
