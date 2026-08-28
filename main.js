/**
 * Ant-Eye Studio — Main Interactive Script
 * Navigation, Scroll Reveals, Contact Form, Three.js Particle Hero & Custom Viewfinder Cursor
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Navigation & Header Scroll State
     ========================================================================== */

  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function toggleNav() {
    if (!navToggle || !mobileNav) return;
    const isOpen = navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navToggle && mobileNav) {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });


  /* ==========================================================================
     2. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */

  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(function (el) {
      revealIO.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
  }


  /* ==========================================================================
     3. Booking Enquiry Contact Form
     ========================================================================== */

  const form = document.getElementById('enquiry-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const whatsappNumber = (form.dataset.whatsappNumber || '').replace(/\D/g, '');

      if (whatsappNumber.length < 8) {
        console.warn('Add the studio WhatsApp number to data-whatsapp-number on #enquiry-form.');
        return;
      }

      const name = (document.getElementById('name') || {}).value || '';
      const email = (document.getElementById('email') || {}).value || '';
      const type = (document.getElementById('type') || {}).value || '';
      const date = (document.getElementById('date') || {}).value || '';
      const message = (document.getElementById('message') || {}).value || '';

      const subject = encodeURIComponent('Enquiry: ' + type + ' — ' + name);
      const whatsappMessage = encodeURIComponent(
        'Hello Ant-Eye, I would like to make an enquiry.\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Shoot type: ' + type + '\n' +
        'Preferred date: ' + (date || 'Flexible') + '\n\n' +
        'Message:\n' + message
      );

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { method: 'WhatsApp' });
      }

      window.location.href = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
      }
    });
  }


  /* ========================================================================== 
     4. Cloudinary Portfolio Rotation
     ========================================================================== */

  function shuffle(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  async function rotatePortfolioImages() {
    const imageSlots = Array.from(document.querySelectorAll('.hero-collage img, .gallery img, .insta-cell img'));
    if (!imageSlots.length) return;

    try {
      const response = await fetch('/api/portfolio', { headers: { Accept: 'application/json' } });
      if (!response.ok) return;

      const { images } = await response.json();
      if (!Array.isArray(images) || !images.length) return;

      let selection = shuffle(images);
      imageSlots.forEach(function (slot, index) {
        if (index > 0 && index % selection.length === 0) selection = shuffle(images);
        const image = selection[index % selection.length];
        slot.src = image.src;
        slot.alt = image.alt || slot.alt;
      });
    } catch (error) {
      // The local image set remains visible if the portfolio service is unavailable.
      console.warn('Cloudinary portfolio rotation is unavailable.', error);
    }
  }

  rotatePortfolioImages();


  /* ========================================================================== 
     5. Hero Bokeh Particle Field (Three.js WebGL / Canvas Fallback)
     ========================================================================== */

  let _particlesInit = false;

  function initParticles() {
    if (_particlesInit) return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (typeof THREE !== 'undefined') {
      try {
        _particlesInit = true;
        const hero = document.querySelector('.hero');
        let width = hero ? hero.offsetWidth : window.innerWidth;
        let height = hero ? hero.offsetHeight : window.innerHeight;

        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 30;

        const N = 200;
        const positions = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 80;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const dotCanvas = document.createElement('canvas');
        dotCanvas.width = dotCanvas.height = 32;
        const dotCtx = dotCanvas.getContext('2d');
        const dotGrad = dotCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        dotGrad.addColorStop(0, 'rgba(242,236,225,1)');
        dotGrad.addColorStop(0.4, 'rgba(242,236,225,0.6)');
        dotGrad.addColorStop(1, 'rgba(242,236,225,0)');
        dotCtx.fillStyle = dotGrad;
        dotCtx.beginPath();
        dotCtx.arc(16, 16, 16, 0, Math.PI * 2);
        dotCtx.fill();

        const tex = new THREE.CanvasTexture(dotCanvas);
        const mat = new THREE.PointsMaterial({
          map: tex,
          size: 1.6,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: 0xf2ece1
        });
        const pts = new THREE.Points(geo, mat);
        scene.add(pts);

        const ORB_COUNT = 5;
        const orbPositions = new Float32Array(ORB_COUNT * 3);
        for (let j = 0; j < ORB_COUNT; j++) {
          orbPositions[j * 3] = (Math.random() - 0.5) * 60;
          orbPositions[j * 3 + 1] = (Math.random() - 0.5) * 40;
          orbPositions[j * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
        }
        const orbGeo = new THREE.BufferGeometry();
        orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPositions, 3));
        const orbMat = new THREE.PointsMaterial({
          map: tex,
          size: 16,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.08,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: 0xb5432f
        });
        scene.add(new THREE.Points(orbGeo, orbMat));

        const mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', function (e) {
          mouse.x = (e.clientX / window.innerWidth - 0.5);
          mouse.y = (e.clientY / window.innerHeight - 0.5);
        }, { passive: true });

        function onResize() {
          if (!hero) return;
          width = hero.offsetWidth;
          height = hero.offsetHeight;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', onResize, { passive: true });

        let isHeroVisible = true;
        let t = 0;

        function animate() {
          if (isHeroVisible) {
            t += 0.004;
            pts.rotation.y = mouse.x * 0.12 + Math.sin(t * 0.3) * 0.03;
            pts.rotation.x = mouse.y * 0.08 + Math.cos(t * 0.2) * 0.02;

            const pa = geo.attributes.position.array;
            for (let k = 0; k < N; k++) {
              pa[k * 3 + 1] += Math.sin(t + k * 0.3) * 0.006;
              pa[k * 3] += Math.cos(t + k * 0.2) * 0.003;
            }
            geo.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
          }
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        if (hero && 'IntersectionObserver' in window) {
          const heroObs = new IntersectionObserver(function (entries) {
            isHeroVisible = entries[0].isIntersecting;
          }, { threshold: 0.05 });
          heroObs.observe(hero);
        }

        return;
      } catch (err) {
        console.warn('Three.js hero particles fallback:', err);
      }
    }

    // 2D Canvas Fallback
    _particlesInit = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', function () {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function render2d() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(242,236,225,' + p.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(render2d);
    }
    render2d();
  }


  /* ==========================================================================
     5. Custom Rangefinder / Viewfinder Cursor (Three.js WebGL + DOM Reticle)
     ========================================================================== */

  let _cursorInit = false;

  function initCustomCursor() {
    if (_cursorInit) return;

    const cursorWrap = document.getElementById('custom-cursor');
    const cursorCanvas = document.getElementById('cursor-canvas');
    const shutter = document.getElementById('cursor-shutter');

    if (!cursorWrap) return;
    _cursorInit = true;

    // Mouse coordinates state
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let isTouch = false;
    let isMoving = false;

    // Temporarily hide custom cursor during active touch gestures
    window.addEventListener('touchstart', function () {
      isTouch = true;
      cursorWrap.classList.remove('active');
      document.body.classList.remove('custom-cursor-active');
      if (cursorCanvas) cursorCanvas.style.display = 'none';
    }, { passive: true });

    // Track mouse coordinates & reactivate on mouse movement
    function onMouseMove(e) {
      isTouch = false;
      isMoving = true;
      targetX = e.clientX;
      targetY = e.clientY;

      cursorWrap.classList.add('active');
      document.body.classList.add('custom-cursor-active');
      if (cursorCanvas) cursorCanvas.style.display = 'block';
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', function (e) {
      isTouch = false;
      targetX = e.clientX || targetX;
      targetY = e.clientY || targetY;
      cursorWrap.classList.add('active');
      document.body.classList.add('custom-cursor-active');
      if (cursorCanvas) cursorCanvas.style.display = 'block';
    });
    document.addEventListener('mouseleave', function () {
      cursorWrap.classList.remove('active');
    });

    // Shutter Click Pulse Effect
    window.addEventListener('mousedown', function () {
      if (isTouch) return;
      if (shutter) {
        shutter.classList.remove('pulse');
        void shutter.offsetWidth; // Trigger reflow
        shutter.classList.add('pulse');
      }
    }, { passive: true });

    // Hover mode bindings
    function bindHover() {
      // 1. Interactive links, buttons, inputs
      document.querySelectorAll('a, button, input, select, textarea, .nav-toggle, .submit-btn, .insta-follow').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (!isTouch) cursorWrap.classList.add('hover-link');
        });
        el.addEventListener('mouseleave', function () {
          cursorWrap.classList.remove('hover-link');
        });
      });

      // 2. Visual gallery items and photography frames
      document.querySelectorAll('.g-item, .insta-cell, .about-frame, .hc-frame').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (!isTouch) cursorWrap.classList.add('hover-gallery');
        });
        el.addEventListener('mouseleave', function () {
          cursorWrap.classList.remove('hover-gallery');
        });
      });
    }
    bindHover();

    // --- Optional Three.js Sparkle Dust / Trail Layer ---
    let threeRenderer = null;
    let threeScene = null;
    let threeCamera = null;
    let trailGeo = null;
    let trailMat = null;
    const TRAIL_COUNT = 14;
    const trailPositions = new Float32Array(TRAIL_COUNT * 3);
    const trailHistory = [];

    if (cursorCanvas && typeof THREE !== 'undefined') {
      try {
        let w = window.innerWidth;
        let h = window.innerHeight;

        threeRenderer = new THREE.WebGLRenderer({
          canvas: cursorCanvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
        threeRenderer.setSize(w, h, false);
        threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        threeRenderer.setClearColor(0x000000, 0);

        threeScene = new THREE.Scene();
        threeCamera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
        threeCamera.position.z = 10;

        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailHistory.push({ x: 0, y: 0 });
        }

        trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

        const tCanvas = document.createElement('canvas');
        tCanvas.width = tCanvas.height = 16;
        const tCtx = tCanvas.getContext('2d');
        const tGrad = tCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        tGrad.addColorStop(0, 'rgba(181,67,47,0.85)');
        tGrad.addColorStop(0.5, 'rgba(242,236,225,0.4)');
        tGrad.addColorStop(1, 'rgba(0,0,0,0)');
        tCtx.fillStyle = tGrad;
        tCtx.beginPath();
        tCtx.arc(8, 8, 8, 0, Math.PI * 2);
        tCtx.fill();
        const tTex = new THREE.CanvasTexture(tCanvas);

        trailMat = new THREE.PointsMaterial({
          map: tTex,
          size: 7,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        threeScene.add(new THREE.Points(trailGeo, trailMat));

        window.addEventListener('resize', function () {
          w = window.innerWidth;
          h = window.innerHeight;
          threeRenderer.setSize(w, h, false);
          threeCamera.left = -w / 2;
          threeCamera.right = w / 2;
          threeCamera.top = h / 2;
          threeCamera.bottom = -h / 2;
          threeCamera.updateProjectionMatrix();
        }, { passive: true });

      } catch (e) {
        console.warn('Three.js cursor dust trail skipped:', e);
      }
    }

    // --- Main Smooth Animation Loop ---
    function renderLoop() {
      if (!isTouch) {
        // High-precision smooth lerp
        curX += (targetX - curX) * 0.35;
        curY += (targetY - curY) * 0.35;

        // Hardware-accelerated GPU translation
        cursorWrap.style.transform = 'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px, 0)';

        // Three.js Trail update if available
        if (threeRenderer && threeScene && threeCamera && isMoving) {
          const scX = curX - window.innerWidth / 2;
          const scY = window.innerHeight / 2 - curY;

          trailHistory.unshift({ x: scX, y: scY });
          trailHistory.pop();

          const posArr = trailGeo.attributes.position.array;
          for (let k = 0; k < TRAIL_COUNT; k++) {
            const pt = trailHistory[k];
            posArr[k * 3] = pt.x;
            posArr[k * 3 + 1] = pt.y;
            posArr[k * 3 + 2] = 0;
          }
          trailGeo.attributes.position.needsUpdate = true;
          threeRenderer.render(threeScene, threeCamera);
        }
      }

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  }


  /* ==========================================================================
     6. Master Initialization
     ========================================================================== */

  function initAll() {
    initParticles();
    initCustomCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.addEventListener('load', function () {
    initAll();
  });

})();
