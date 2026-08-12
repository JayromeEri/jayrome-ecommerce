// ============================================================
// Blush & Bows — Interactivity
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Soft fade-in on scroll ----
  const fadeEls = document.querySelectorAll('.fade-section');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Skip animation, just reveal everything
    fadeEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small stagger for a gentle, cascading feel
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    fadeEls.forEach((el, i) => {
      // Stagger service cards slightly so they cascade in rather than pop together
      if (el.classList.contains('service-card')) {
        el.dataset.delay = (i % 4) * 90;
      }
      observer.observe(el);
    });
  }

  // ---- Subtle cute hover tilt on buttons (mouse-follow micro tilt) ----
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = (x / rect.width) * -6;
      btn.style.transform = `translateY(-3px) scale(1.03) rotate(${tiltY * 0.15}deg)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');

  if (navToggle && navLinksEl) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinksEl.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu after tapping a link
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close if resized back to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // ---- Active nav link highlight on scroll ----
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.nav-links a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.style.color = '');
          link.style.color = 'var(--rose-deep)';
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => navObserver.observe(sec));
  }

});
