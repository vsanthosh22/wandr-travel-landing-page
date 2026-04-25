/* ================================
   WANDR – MAIN JAVASCRIPT
   js/main.js
================================= */


/* ================================
   NAVBAR SCROLL EFFECT
================================= */
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
});


/* ================================
   SMOOTH ACTIVE NAV LINK
   Highlights nav link for the
   currently visible section
================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
      });
      const activeLink = document.querySelector(
        `.navbar-nav .nav-link[href="#${entry.target.id}"]`
      );
      if (activeLink) {
        activeLink.style.color = '#C9A84C';
        activeLink.style.background = 'rgba(201, 168, 76, 0.1)';
      }
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


/* ================================
   SCROLL REVEAL ANIMATION
   Adds .visible to elements with
   .reveal class when scrolled into view
================================= */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));


/* ================================
   AUTO-CLOSE MOBILE MENU
   Closes navbar when a nav link
   is clicked on mobile
================================= */
const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});


/* ================================
   SCREENSHOTS DRAG TO SCROLL
   Allows click-drag scrolling on
   the screenshots strip section
================================= */
const strip = document.querySelector('.screenshots-strip');

if (strip) {
  let isDown = false;
  let startX;
  let scrollLeft;

  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    strip.style.cursor = 'grabbing';
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });

  strip.addEventListener('mouseleave', () => {
    isDown = false;
    strip.style.cursor = 'grab';
  });

  strip.addEventListener('mouseup', () => {
    isDown = false;
    strip.style.cursor = 'grab';
  });

  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 1.5;
    strip.scrollLeft = scrollLeft - walk;
  });

  strip.style.cursor = 'grab';
}


/* ================================
   STAT COUNTER ANIMATION
   Animates numbers from 0 to final
   value when stats section is visible
================================= */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.floor(current).toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats-section');

if (statsSection) {
  const statEls = statsSection.querySelectorAll('.stat-big');
  let hasAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      hasAnimated = true;

      const targets = [
        { value: 2, suffix: 'M+' },
        { value: 190, suffix: '+' },
        { value: 50, suffix: 'K+' },
        { value: 4.9, suffix: '★' }
      ];

      statEls.forEach((el, i) => {
        if (targets[i]) {
          animateCounter(el, targets[i].value, targets[i].suffix);
        }
      });

      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);
}
