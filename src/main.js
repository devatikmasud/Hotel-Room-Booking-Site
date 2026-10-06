/* ===== Shared Site JavaScript ===== */
/* Handles: mobile nav toggle, sticky nav scroll, background gallery,
   lightbox, scroll reveal, smooth scroll, active nav link.        */

/* ---------- Config: update these to match your details ---------- */
const SITE_CONFIG = {
  whatsappNumber: '1234567890',       // International format, no + or spaces
  whatsappMessage: "Hello, I'd like to book a room.",
  email: 'stay@yourhotel.com',
  hotelName: 'Maison Serenity',
};

/* ---------- Mobile Nav Toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const cta = document.querySelector('.nav__cta');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links?.classList.toggle('open');
    cta?.classList.toggle('open');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav__links a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links?.classList.remove('open');
      cta?.classList.remove('open');
    });
  });
}

/* ---------- Sticky Nav Shadow on Scroll ---------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Active Nav Link ---------- */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------- Hero Background Gallery (auto-looping) ---------- */
function initHeroGallery() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  if (slides.length === 0) return;

  let current = 0;
  const interval = 5000;

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function next() {
    show((current + 1) % slides.length);
  }

  // Auto-play
  let timer = setInterval(next, interval);

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      show(i);
      timer = setInterval(next, interval);
    });
  });
}

/* ---------- Gallery Lightbox ---------- */
function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (triggers.length === 0) return;

  // Build lightbox DOM
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Close image viewer">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <button class="lightbox__prev" aria-label="Previous image">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <img class="lightbox__img" src="" alt="" />
    <button class="lightbox__next" aria-label="Next image">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <p class="lightbox__caption"></p>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');

  const items = Array.from(triggers);
  let currentIdx = 0;

  function show(idx) {
    currentIdx = (idx + items.length) % items.length;
    const el = items[currentIdx];
    const fullSrc = el.getAttribute('data-lightbox');
    const caption = el.getAttribute('data-caption') || '';
    lbImg.src = fullSrc;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
  }

  function open(idx) {
    show(idx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(currentIdx - 1));
  btnNext.addEventListener('click', () => show(currentIdx + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIdx - 1);
    if (e.key === 'ArrowRight') show(currentIdx + 1);
  });
}

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------- WhatsApp Link Builder ---------- */
function initWhatsAppLinks() {
  const links = document.querySelectorAll('[data-whatsapp]');
  const msg = encodeURIComponent(SITE_CONFIG.whatsappMessage);
  const num = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  links.forEach((link) => {
    link.href = `https://wa.me/${num}?text=${msg}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

/* ---------- Email Link Builder ---------- */
function initEmailLinks() {
  const links = document.querySelectorAll('[data-email]');
  links.forEach((link) => {
    link.href = `mailto:${SITE_CONFIG.email}`;
  });
}

/* ---------- Contact Form (front-end only, opens mailto) ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const checkin = form.querySelector('[name="checkin"]')?.value || '';
    const checkout = form.querySelector('[name="checkout"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const subject = `Booking Enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\n\n${message}`;

    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* ---------- Initialise Everything ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initNavScroll();
  initActiveNav();
  initHeroGallery();
  initLightbox();
  initScrollReveal();
  initWhatsAppLinks();
  initEmailLinks();
  initContactForm();
  initBookingBar();
});


/* ---------- Hero booking bar: sends dates to WhatsApp ---------- */
function initBookingBar() {
  const form = document.getElementById('booking');
  if (!form) return;
  const inEl = form.elements['in'];
  const outEl = form.elements['out'];
  const today = new Date().toISOString().split('T')[0];
  inEl.min = today;
  outEl.min = today;
  inEl.addEventListener('change', () => {
    outEl.min = inEl.value || today;
    if (outEl.value && outEl.value < inEl.value) outEl.value = inEl.value;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = `${SITE_CONFIG.whatsappMessage} Check-in: ${inEl.value}, check-out: ${outEl.value}, ${form.elements['guests'].value}.`;
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}
