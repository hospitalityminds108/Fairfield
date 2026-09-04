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
    var current = 0;
    var timer;

    function goTo(i) {
      slides[current].classList.remove('active');
      if (dotsWrap) dotsWrap.children[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dotsWrap) dotsWrap.children[current].classList.add('active');
    }
    function next() { goTo(current + 1); }
    function start() { timer = setInterval(next, 5500); }
    function stop() { clearInterval(timer); }

    if (dotsWrap) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        if (i === 0) b.classList.add('active');
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        b.addEventListener('click', function () { stop(); goTo(i); start(); });
        dotsWrap.appendChild(b);
      });
    }
    if (slides.length > 1) {
      start();
      slider.closest('.hero').addEventListener('mouseenter', stop);
      slider.closest('.hero').addEventListener('mouseleave', start);
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
