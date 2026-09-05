/* =========================================================
   Vira & Reva Celebrations — Master Script
   Scroll reveals · mobile nav · nav scroll state · builder
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    // close on link click (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 1000) {
          links.classList.remove('open');
          toggle.classList.remove('open');
        }
      });
    });
  }

  /* ---------- Nav scroll shadow ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero image slider (homepage) ---------- */
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.hero-slide');
    var dotsWrap = document.querySelector('.hero-dots');
    var SLIDE_MS = 6500; // how long each slide stays on screen
    var current = 0;
    var timer = null;
    var hovered = false;

    // Restart the Ken Burns zoom on a slide every time it becomes active,
    // instead of letting the animation loop forever in the background —
    // that's what was causing the visible "jump" in zoom level on change.
    function restartZoom(slide) {
      slide.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      slide.offsetHeight; // force reflow so the animation can be re-triggered
      slide.style.animation = '';
    }

    function goTo(i) {
      slides[current].classList.remove('active');
      if (dotsWrap) dotsWrap.children[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      var activeSlide = slides[current];
      activeSlide.classList.add('active');
      restartZoom(activeSlide);
      if (dotsWrap) dotsWrap.children[current].classList.add('active');
    }
    function next() { goTo(current + 1); }
    function start() {
      stop(); // never let two intervals stack up
      if (slides.length > 1 && !hovered && !document.hidden) {
        timer = setInterval(next, SLIDE_MS);
      }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // Belt-and-braces: whatever the markup says, make sure exactly one
    // slide (the first) is visible immediately — this is what was leaving
    // the hero blank until the first interval fired.
    slides.forEach(function (s, i) { s.classList.toggle('active', i === 0); });

    if (dotsWrap) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        if (i === 0) b.classList.add('active');
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        b.addEventListener('click', function () { goTo(i); start(); });
        dotsWrap.appendChild(b);
      });
    }
    if (slides.length) {
      restartZoom(slides[0]);
    }
    if (slides.length > 1) {
      start();
      var heroEl = slider.closest('.hero');
      heroEl.addEventListener('mouseenter', function () { hovered = true; stop(); });
      heroEl.addEventListener('mouseleave', function () { hovered = false; start(); });
      // Pause fetching/animating while the tab isn't visible so the slider
      // doesn't silently "catch up" through several slides at once when
      // the user switches back to this tab.
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });
    }
  }

  /* ---------- Celebration builder → WhatsApp ---------- */
  var form = document.querySelector('#celebration-builder');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var event = d.get('event') || '';
      var guests = d.get('guests') || '';
      var date = d.get('date') || '';
      var food = d.get('food') || '';
      var name = d.get('name') ? '\nName: ' + d.get('name') : '';
      var venue = Number(guests) <= 40 ? 'Reva (intimate)' : 'Vira (larger)';
      var msg =
        'Hi, I am planning a ' + event + ' at Fairfield by Marriott Mumbai Andheri West.\n' +
        'Guests: ' + guests + '\n' +
        'Preferred date: ' + date + '\n' +
        'Food preference: ' + food + '\n' +
        'Suggested venue: ' + venue + '\n' +
        'Please share availability, menu and a customised package.' + name;
      window.open('https://wa.me/919833012386?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* ---------- Set date min = today ---------- */
  var dateField = document.querySelector('input[name="date"]');
  if (dateField) {
    var t = new Date();
    var iso = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    dateField.min = iso;
  }

  /* ---------- Smooth anchor focus (accessibility) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          // allow default smooth scroll; just ensure focusable
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        }
      }
    });
  });
})();

/* ---------- Premium Location Chip Effects ---------- */
(function() {
  const chips = document.querySelectorAll('.loc-chip[data-tilt]');

  chips.forEach(chip => {
    const glow = chip.querySelector('.chip-glow');

    chip.addEventListener('mousemove', (e) => {
      const rect = chip.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Move the glow
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }

      // Calculate 3D Tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Max rotation degrees
      const maxRotate = 8; 
      
      const rotateX = ((y - centerY) / centerY) * -maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      chip.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    chip.addEventListener('mouseleave', () => {
      // Reset position
      chip.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });
})();