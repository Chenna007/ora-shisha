/* ============================================================
   ORA SHISHA & BAR — PREMIUM NIGHTCLUB WEBSITE
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── SCROLL PROGRESS BAR ─── */
  const progress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = scrolled + '%';
  }, { passive: true });

  /* ─── CUSTOM CURSOR ─── */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const ringLag = 0.14;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * ringLag;
    ringY += (mouseY - ringY) * ringLag;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover enlarge ring on interactive elements
  document.querySelectorAll('a, button, .gallery-item, .offer-card, .menu-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ─── STICKY HEADER ─── */
  const headerFixed = document.getElementById('header-fixed');
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isScrolled = lastScrollY > 60;
        headerFixed.classList.toggle('scrolled', isScrolled);
        navbar.classList.toggle('scrolled', isScrolled);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ─── MOBILE HAMBURGER ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── ANIMATED COUNTERS ─── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  /* ─── PARTICLE SYSTEM (hero) ─── */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 40; // Reduced from 60 to improve performance
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const colors = ['#00d4ff', '#a855f7', '#f72585', '#06ffd6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.className = 'particle';
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      left: 0;
      top: 0;
      opacity: ${Math.random() * 0.6 + 0.1};
      box-shadow: 0 0 ${size * 3}px ${color};
      will-change: transform, opacity;
    `;
    particleContainer.appendChild(p);
    particles.push({
      el: p,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03,
      opacity: parseFloat(p.style.opacity),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    });
  }

  function animateParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = 100;
      else if (p.x > 100) p.x = 0;

      if (p.y < 0) p.y = 100;
      else if (p.y > 100) p.y = 0;

      p.opacity += p.opacityDir * 0.005;
      if (p.opacity > 0.7 || p.opacity < 0.05) p.opacityDir *= -1;

      // Use translate3d for GPU acceleration
      p.el.style.transform = `translate3d(${p.x}vw, ${p.y}vh, 0)`;
      p.el.style.opacity = p.opacity;
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ─── GALLERY FILTER ─── */
  const filterBtns = document.querySelectorAll('.gf-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = '';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  /* ─── GALLERY LIGHTBOX ─── */
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose = document.getElementById('lbClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gp-label')?.textContent || 'Gallery';
      const placeholder = item.querySelector('.gallery-placeholder');
      const bg = placeholder ? getComputedStyle(placeholder).background : '';
      lbContent.innerHTML = `
        <div style="text-align:center; padding:40px;">
          <div style="width:300px; height:200px; background:${bg}; border-radius:12px; margin:0 auto 20px; position:relative; overflow:hidden;">
            <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(0,212,255,0.15), transparent);"></div>
            <div style="position:absolute;bottom:12px;left:12px;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);">${label}</div>
          </div>
          <p style="font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">Replace with actual photo</p>
          <p style="font-size:0.75rem;color:rgba(255,255,255,0.2);margin-top:8px;">Add your images to /images/ folder</p>
        </div>`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── RESERVATION FORM ─── */
  const reserveForm = document.getElementById('reserveForm');
  const toast = document.getElementById('toast');
  if (reserveForm) {
    reserveForm.addEventListener('submit', e => {
      e.preventDefault();
      toast.classList.add('show');
      reserveForm.reset();
      setTimeout(() => toast.classList.remove('show'), 4000);
    });
  }

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── PARALLAX on rooftop section ─── */
  const rooftopParallax = document.querySelector('.rooftop-parallax');
  if (rooftopParallax) {
    window.addEventListener('scroll', () => {
      const rect = rooftopParallax.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top / window.innerHeight) * 30;
        rooftopParallax.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }

  /* ─── NEON GLOW INTENSIFY on hover for offer cards ─── */
  document.querySelectorAll('.offer-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.querySelector('.card-glow').style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.1) 0%, transparent 70%)`;
    });
  });

  /* ─── ACTIVE NAV LINK on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--neon-blue)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ─── STAGGERED reveal for offer cards ─── */
  document.querySelectorAll('.offer-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
  });

  /* ─── HERO entrance animation ─── */
  const heroElements = document.querySelectorAll('#hero .reveal');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 200);
  });

});
