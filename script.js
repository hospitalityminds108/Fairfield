// ---------- Scroll progress bar ----------
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    bar.style.width = height > 0 ? (scrolled / height) * 100 + '%' : '0%';
  };
  window.addEventListener('scroll', update);
  update();
})();

// ---------- Back to top ----------
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ---------- Scroll reveal ----------
(function scrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-group');
  if (!targets.length || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  targets.forEach((t) => io.observe(t));
})();

// ---------- Stat counters ----------
(function statCounters() {
  const stats = document.querySelectorAll('[data-count-to]');
  if (!stats.length || !('IntersectionObserver' in window)) return;
  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const suffix = el.getAttribute('data-count-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((s) => io.observe(s));
})();

// ---------- Header scroll state ----------
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// ---------- Hero flip carousel ----------
(function heroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function render() {
    slides.forEach((s, i) => {
      s.classList.remove('is-active', 'is-prev');
      if (i === current) s.classList.add('is-active');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    slides[current].classList.add('is-prev');
    current = (index + slides.length) % slides.length;
    render();
    restart();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  render();
  restart();
})();

// ---------- Enquiry form (sends lead to WhatsApp) ----------
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  const WHATSAPP_NUMBER = '919833012386'; // +91 9833012386, no plus/spaces for the wa.me link

  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = leadForm.name.value.trim();
    const mobile = leadForm.mobile.value.trim();
    const email = leadForm.email.value.trim();
    const event = leadForm.event.value;
    const message = leadForm.message.value.trim();

    let waText =
      'New Enquiry - Vira & Reva Banquets' +
      '\nName: ' + name +
      '\nMobile Number: ' + mobile +
      '\nEmail ID: ' + email +
      '\nEvent Type: ' + event;

    if (message) {
      waText += '\nMessage: ' + message;
    }

    const waLink = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText);

    document.getElementById('success').style.display = 'block';
    window.open(waLink, '_blank', 'noopener');

    leadForm.reset();
  });
}

// ---------- Footer newsletter ----------
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.value = '';
    input.placeholder = 'Subscribed — thank you!';
  });
}
