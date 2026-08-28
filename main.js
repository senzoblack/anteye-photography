/**
 * Ant-Eye Studio — Main Interactive Script
 * Navigation, Scroll Reveals, Cinematic Case Studies, Studio Reel, 
 * Before/After Retouch Slider, Contact Sheet Mode, Three.js Particle Hero & Custom Viewfinder Cursor
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
     3. Booking Enquiry Contact Form & Smart Pre-fill Flow
     ========================================================================== */

  const form = document.getElementById('enquiry-form');
  const formSuccess = document.getElementById('form-success');
  const typeSelect = document.getElementById('type');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const whatsappNumber = (form.dataset.whatsappNumber || '27820000000').replace(/\D/g, '');

      const name = (document.getElementById('name') || {}).value || '';
      const email = (document.getElementById('email') || {}).value || '';
      const shootType = (typeSelect || {}).value || '';
      const budget = (document.getElementById('budget') || {}).value || '';
      const date = (document.getElementById('date') || {}).value || '';
      const message = (document.getElementById('message') || {}).value || '';

      const replyChoice = document.querySelector('input[name="reply-via"]:checked');
      const replyMethod = replyChoice ? replyChoice.value : 'WhatsApp';

      if (replyMethod === 'Email') {
        const mailtoSubject = encodeURIComponent('Booking Enquiry: ' + shootType + ' — ' + name);
        const mailtoBody = encodeURIComponent(
          'Hello Ant-Eye Studio,\n\n' +
          'I would like to enquire about a photography booking.\n\n' +
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Shoot Type: ' + shootType + '\n' +
          'Estimated Budget: ' + budget + '\n' +
          'Preferred Date: ' + (date || 'Flexible / To discuss') + '\n\n' +
          'Project Details:\n' + message + '\n\n' +
          'Looking forward to hearing from you.'
        );

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { method: 'Email' });
        }

        window.location.href = 'mailto:info@anteye.media?subject=' + mailtoSubject + '&body=' + mailtoBody;
      } else {
        const whatsappMessage = encodeURIComponent(
          'Hello Ant-Eye Studio, I would like to make an enquiry.\n\n' +
          '• Name: ' + name + '\n' +
          '• Email: ' + email + '\n' +
          '• Shoot Type: ' + shootType + '\n' +
          '• Estimated Budget: ' + budget + '\n' +
          '• Preferred Date: ' + (date || 'Flexible') + '\n\n' +
          'Message:\n' + message
        );

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { method: 'WhatsApp' });
        }

        window.location.href = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;
      }

      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
      }
    });
  }

  // Pre-fill enquiry form helper
  function selectShootTypeAndScroll(shootTypeName) {
    if (typeSelect) {
      let matched = false;
      for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].text.toLowerCase().includes(shootTypeName.toLowerCase())) {
          typeSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        typeSelect.value = shootTypeName;
      }
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () {
        const nameInput = document.getElementById('name');
        if (nameInput) {
          nameInput.focus();
          nameInput.parentElement.style.transition = 'box-shadow 0.4s ease';
          nameInput.parentElement.style.boxShadow = '0 0 16px rgba(181, 67, 47, 0.4)';
          setTimeout(function () {
            nameInput.parentElement.style.boxShadow = '';
          }, 1600);
        }
      }, 600);
    }
  }


  /* ==========================================================================
     4. Cinematic Project Stories (Full-Screen Editorial Case Studies)
     ========================================================================== */

  const PROJECTS_DATA = [
    {
      id: 0,
      title: 'Portrait Study — Coastal Light',
      category: 'Portraiture',
      client: 'Personal Series',
      year: '2025',
      location: 'Durban Beachfront, KZN',
      story: 'Captured during late-afternoon coastal atmospheric haze. The objective was stripping away excessive staging to let natural posture and micro-expressions take precedence over high-key studio convention.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 50mm f/1.2 GM',
        lighting: 'Available sunset ambient + soft fill',
        colour: 'Ant-Eye Warm Editorial LUT'
      },
      shootType: 'Portrait session',
      frames: [
        { src: 'images/_anteye_1739876056_3570661616708530642_1198388391.jpg', exif: 'f/1.8 · 1/200 · ISO 200' },
        { src: 'images/_anteye_1739876056_3570661616708579310_1198388391.jpg', exif: 'f/1.8 · 1/320 · ISO 160' },
        { src: 'images/_anteye_1739876056_3570661616700172182_1198388391.jpg', exif: 'f/2.0 · 1/250 · ISO 200' }
      ]
    },
    {
      id: 1,
      title: 'Live Event — After Dark',
      category: 'Events & Culture',
      client: 'Northshore Media',
      year: '2025',
      location: 'Durban, KZN',
      story: 'Documenting nightlife culture with low-light speed and high-contrast character. Preserving deep atmospheric shadows while capturing authentic candid energy in movement.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 35mm f/1.4 GM',
        lighting: 'Available stage glow & ambient strobes',
        colour: 'Ant-Eye Deep Noir Contrast'
      },
      shootType: 'Event',
      frames: [
        { src: 'images/_anteye_1728500959_3475240391101690894_1198388391.jpg', exif: 'f/2.8 · 1/250 · ISO 1600' },
        { src: 'images/_anteye_1728500959_3475240391101818361_1198388391.jpg', exif: 'f/2.8 · 1/320 · ISO 2000' },
        { src: 'images/_anteye_1728500959_3475240391101822670_1198388391.jpg', exif: 'f/2.2 · 1/200 · ISO 1600' }
      ]
    },
    {
      id: 2,
      title: 'Editorial — Coastal Light & Form',
      category: 'Editorial & Story',
      client: 'Veld Magazine',
      year: '2025',
      location: 'North Coast, Durban',
      story: 'A cinematic exploration of texture, coastline breeze, and contemporary African minimalism. Shot on location with a documentary-first editorial rhythm and unhurried pacing.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 85mm f/1.4 GM',
        lighting: 'Direct morning sun + negative fill',
        colour: 'Ant-Eye Muted Olive & Terracotta'
      },
      shootType: 'Editorial / Story',
      frames: [
        { src: 'images/_anteye_1755886681_3704968477695218191_1198388391.webp', exif: 'f/2.0 · 1/320 · ISO 400' },
        { src: 'images/_anteye_1755886681_3704968477686840730_1198388391.webp', exif: 'f/2.8 · 1/500 · ISO 200' },
        { src: 'images/_anteye_1755886681_3704968477703626442_1198388391.webp', exif: 'f/2.0 · 1/400 · ISO 250' }
      ]
    },
    {
      id: 3,
      title: 'Street Portraiture — Urban Rhythm',
      category: 'Portraiture',
      client: 'Independent Series',
      year: '2025',
      location: 'Joburg Central & Durban',
      story: 'Environmental portraits connecting individuals with urban architecture. Focusing on posture, candid glance, and rich monochromatic tonal separation.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 35mm f/1.4 GM',
        lighting: 'Reflected architectural daylight',
        colour: 'Ant-Eye Kodak Tri-X Tone Emulation'
      },
      shootType: 'Portrait session',
      frames: [
        { src: 'images/_anteye_1739876056_3570661616708741734_1198388391.jpg', exif: 'f/1.4 · 1/500 · ISO 320' },
        { src: 'images/_anteye_1739876056_3570661616717059379_1198388391.jpg', exif: 'f/1.8 · 1/640 · ISO 200' },
        { src: 'images/_anteye_1739876056_3570661616725350934_1198388391.jpg', exif: 'f/1.4 · 1/400 · ISO 400' }
      ]
    },
    {
      id: 4,
      title: 'Kin Studio — Lifestyle & Craft',
      category: 'Brand & Product',
      client: 'Kin Studio & Apparel',
      year: '2025',
      location: 'Durban, KZN',
      story: 'Modern lifestyle imagery crafted for conscious brand identity. Balancing organic textures, tactile details, and quiet confidence that feels enduring outside the social feed.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 50mm f/1.2 GM',
        lighting: 'Diffused window light + white bounce',
        colour: 'Ant-Eye Warm Linen Grade'
      },
      shootType: 'Brand / Product',
      frames: [
        { src: 'images/_anteye_1755634100_3702849676006464938_1198388391.webp', exif: 'f/2.8 · 1/400 · ISO 200' },
        { src: 'images/_anteye_1755634100_3702849675998054383_1198388391.webp', exif: 'f/2.0 · 1/320 · ISO 320' },
        { src: 'images/_anteye_1755634100_3702849675998091622_1198388391.webp', exif: 'f/2.8 · 1/500 · ISO 160' }
      ]
    },
    {
      id: 5,
      title: 'Echo Records — Tour Live',
      category: 'Events & Music',
      client: 'Echo Records South Africa',
      year: '2025',
      location: 'KZN Music Showcase',
      story: 'High-energy performance documentation capturing the raw connection between artists and live crowd emotion without disruptive direct flash equipment.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 70-200mm f/2.8 GM II',
        lighting: 'Dynamic stage LED backlighting',
        colour: 'Ant-Eye Vivid Analog Tint'
      },
      shootType: 'Event',
      frames: [
        { src: 'images/_anteye_1755634100_3702849675998032120_1198388391.webp', exif: 'f/2.8 · 1/160 · ISO 3200' },
        { src: 'images/_anteye_1728500959_3475240391294693681_1198388391.jpg', exif: 'f/2.8 · 1/200 · ISO 2500' },
        { src: 'images/_anteye_1728500959_3475240391319928843_1198388391.jpg', exif: 'f/2.8 · 1/160 · ISO 3200' }
      ]
    },
    {
      id: 6,
      title: 'Intimate Character & Form',
      category: 'Portraiture',
      client: 'Studio Lookbook',
      year: '2025',
      location: 'Durban Studio',
      story: 'A minimalist exploration of light sculpting contours, subtle skin tones, and quiet gaze. Designed to feel intimate, editorial, and timeless.',
      tech: {
        camera: 'Sony Alpha A7 IV',
        optics: 'FE 85mm f/1.4 GM',
        lighting: 'Single parabolic key light + negative fill',
        colour: 'Ant-Eye Darkroom Editorial Grade'
      },
      shootType: 'Portrait session',
      frames: [
        { src: 'images/_anteye_1755886681_3704968477695236885_1198388391.webp', exif: 'f/1.8 · 1/250 · ISO 160' },
        { src: 'images/_anteye_1755886681_3704968477695244701_1198388391.webp', exif: 'f/2.0 · 1/320 · ISO 200' },
        { src: 'images/_anteye_1715323019_3364695814444442964_1198388391.jpg', exif: 'f/1.8 · 1/200 · ISO 200' }
      ]
    }
  ];

  let currentProjectIndex = 0;
  let currentFrameIndex = 0;

  const dialog = document.getElementById('project-dialog');
  const dialogCloseBtn = document.getElementById('dialog-close');
  const dialogPrevBtn = document.getElementById('project-prev');
  const dialogNextBtn = document.getElementById('project-next');
  const dialogBookBtn = document.getElementById('dialog-book-btn');

  const dialogImage = document.getElementById('dialog-image');
  const dialogFrameNum = document.getElementById('dialog-frame-num');
  const dialogImageExif = document.getElementById('dialog-image-exif');
  const dialogSequenceStrip = document.getElementById('dialog-sequence-strip');

  const projectIndexEl = document.getElementById('project-index');
  const projectCategoryEl = document.getElementById('project-category');
  const projectTitleEl = document.getElementById('project-title');
  const projectLocationEl = document.getElementById('project-location');
  const projectClientEl = document.getElementById('project-client');
  const projectYearEl = document.getElementById('project-year');
  const projectStoryEl = document.getElementById('project-story');
  const projectTechEl = document.getElementById('project-tech');

  function renderProject(projIdx, frameIdx) {
    const project = PROJECTS_DATA[projIdx] || PROJECTS_DATA[0];
    currentProjectIndex = projIdx;
    currentFrameIndex = (frameIdx >= 0 && frameIdx < project.frames.length) ? frameIdx : 0;

    const frame = project.frames[currentFrameIndex];

    if (dialogImage) {
      dialogImage.style.opacity = '0.3';
      dialogImage.src = frame.src;
      dialogImage.alt = project.title + ' — Frame ' + (currentFrameIndex + 1);
      dialogImage.onload = function () {
        dialogImage.style.opacity = '1';
      };
    }

    if (dialogFrameNum) {
      dialogFrameNum.textContent = 'FRAME ' + String(currentFrameIndex + 1).padStart(2, '0') + ' / ' + String(project.frames.length).padStart(2, '0');
    }

    if (dialogImageExif) {
      dialogImageExif.textContent = frame.exif;
    }

    if (projectIndexEl) {
      projectIndexEl.textContent = 'STORY ' + String(project.id + 1).padStart(2, '0') + ' // ' + String(PROJECTS_DATA.length).padStart(2, '0');
    }

    if (projectCategoryEl) projectCategoryEl.textContent = project.category;
    if (projectTitleEl) projectTitleEl.textContent = project.title;
    if (projectLocationEl) projectLocationEl.textContent = project.location;
    if (projectClientEl) projectClientEl.textContent = project.client;
    if (projectYearEl) projectYearEl.textContent = project.year;
    if (projectStoryEl) projectStoryEl.textContent = project.story;

    if (projectTechEl) {
      projectTechEl.innerHTML = 
        '<div><span>Camera</span> <strong>' + project.tech.camera + '</strong></div>' +
        '<div><span>Optics</span> <strong>' + project.tech.optics + '</strong></div>' +
        '<div><span>Lighting</span> <strong>' + project.tech.lighting + '</strong></div>' +
        '<div><span>Colour</span> <strong>' + project.tech.colour + '</strong></div>';
    }

    // Render sequence thumbnails filmstrip
    if (dialogSequenceStrip) {
      dialogSequenceStrip.innerHTML = '';
      project.frames.forEach(function (f, idx) {
        const thumb = document.createElement('div');
        thumb.className = 'dialog-thumb' + (idx === currentFrameIndex ? ' is-active' : '');
        thumb.innerHTML = '<img src="' + f.src + '" alt="Thumbnail ' + (idx + 1) + '">';
        thumb.addEventListener('click', function () {
          renderProject(currentProjectIndex, idx);
        });
        dialogSequenceStrip.appendChild(thumb);
      });
    }
  }

  function openProjectModal(index) {
    if (!dialog) return;
    renderProject(index, 0);
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  function nextProject() {
    const nextIdx = (currentProjectIndex + 1) % PROJECTS_DATA.length;
    renderProject(nextIdx, 0);
  }

  function prevProject() {
    const prevIdx = (currentProjectIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    renderProject(prevIdx, 0);
  }

  // Bind Gallery Tiles to Open Case Studies
  document.querySelectorAll('.g-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const projId = parseInt(item.dataset.projectId, 10);
      openProjectModal(isNaN(projId) ? 0 : projId);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projId = parseInt(item.dataset.projectId, 10);
        openProjectModal(isNaN(projId) ? 0 : projId);
      }
    });
  });

  if (dialogCloseBtn) {
    dialogCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (dialogNextBtn) {
    dialogNextBtn.addEventListener('click', nextProject);
  }

  if (dialogPrevBtn) {
    dialogPrevBtn.addEventListener('click', prevProject);
  }

  if (dialogBookBtn) {
    dialogBookBtn.addEventListener('click', function () {
      const currentProj = PROJECTS_DATA[currentProjectIndex];
      closeProjectModal();
      selectShootTypeAndScroll(currentProj ? currentProj.shootType : 'Portrait session');
    });
  }

  // Keyboard navigation for case study modal
  window.addEventListener('keydown', function (e) {
    if (!dialog || !dialog.open) return;
    if (e.key === 'Escape') {
      closeProjectModal();
    } else if (e.key === 'ArrowRight') {
      nextProject();
    } else if (e.key === 'ArrowLeft') {
      prevProject();
    }
  });


  /* ==========================================================================
     5. Contact Sheet Mode Toggle
     ========================================================================== */

  const contactSheetToggle = document.getElementById('contact-sheet-toggle');
  const portfolioGallery = document.getElementById('portfolio-gallery');

  if (contactSheetToggle && portfolioGallery) {
    contactSheetToggle.addEventListener('click', function () {
      const isSheet = portfolioGallery.classList.toggle('contact-sheet-mode');
      contactSheetToggle.classList.toggle('is-active', isSheet);
      contactSheetToggle.setAttribute('aria-pressed', isSheet ? 'true' : 'false');
    });
  }


  /* ==========================================================================
     6. Studio Reel Controller & Autoplay
     ========================================================================== */

  const studioReel = document.getElementById('studio-reel');
  const reelPlayBtn = document.getElementById('reel-play');
  const reelPrevBtn = document.getElementById('reel-prev');
  const reelNextBtn = document.getElementById('reel-next');

  let reelFrames = [];
  let reelCurrent = 0;
  let reelTimer = null;
  let isReelPlaying = false;

  if (studioReel) {
    reelFrames = Array.from(studioReel.querySelectorAll('.reel-frame'));

    function showReelFrame(idx) {
      if (!reelFrames.length) return;
      reelCurrent = (idx + reelFrames.length) % reelFrames.length;
      reelFrames.forEach(function (f, i) {
        f.classList.toggle('is-active', i === reelCurrent);
      });
    }

    function startReel() {
      stopReel();
      isReelPlaying = true;
      if (reelPlayBtn) {
        reelPlayBtn.textContent = 'Pause sequence';
        reelPlayBtn.setAttribute('aria-pressed', 'true');
      }
      reelTimer = setInterval(function () {
        showReelFrame(reelCurrent + 1);
      }, 3400);
    }

    function stopReel() {
      isReelPlaying = false;
      if (reelTimer) {
        clearInterval(reelTimer);
        reelTimer = null;
      }
      if (reelPlayBtn) {
        reelPlayBtn.textContent = 'Play sequence';
        reelPlayBtn.setAttribute('aria-pressed', 'false');
      }
    }

    if (reelPlayBtn) {
      reelPlayBtn.addEventListener('click', function () {
        if (isReelPlaying) {
          stopReel();
        } else {
          startReel();
        }
      });
    }

    if (reelPrevBtn) {
      reelPrevBtn.addEventListener('click', function () {
        stopReel();
        showReelFrame(reelCurrent - 1);
      });
    }

    if (reelNextBtn) {
      reelNextBtn.addEventListener('click', function () {
        stopReel();
        showReelFrame(reelCurrent + 1);
      });
    }
  }


  /* ==========================================================================
     7. Before / After Retouch Split View Compare Slider
     ========================================================================== */

  const gradeCompare = document.getElementById('grade-compare');
  const gradeRange = document.getElementById('grade-range');

  if (gradeCompare && gradeRange) {
    function updateGradeSplit(val) {
      const clamped = Math.max(0, Math.min(100, val));
      gradeCompare.style.setProperty('--split-pos', clamped + '%');
    }

    gradeRange.addEventListener('input', function (e) {
      updateGradeSplit(e.target.value);
    });

    // Touch & Mouse Dragging on entire compare frame
    let isDraggingGrade = false;

    function handleGradePointer(e) {
      const rect = gradeCompare.getBoundingClientRect();
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const posPct = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(0, Math.min(100, posPct));
      gradeRange.value = clamped;
      updateGradeSplit(clamped);
    }

    gradeCompare.addEventListener('mousedown', function (e) {
      isDraggingGrade = true;
      handleGradePointer(e);
    });

    window.addEventListener('mousemove', function (e) {
      if (isDraggingGrade) {
        handleGradePointer(e);
      }
    });

    window.addEventListener('mouseup', function () {
      isDraggingGrade = false;
    });

    gradeCompare.addEventListener('touchstart', function (e) {
      handleGradePointer(e);
    }, { passive: true });

    gradeCompare.addEventListener('touchmove', function (e) {
      handleGradePointer(e);
    }, { passive: true });
  }


  /* ==========================================================================
     8. Hero Bokeh Particle Field (Three.js WebGL / Canvas Fallback)
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
              pa[k * 3 + 2] += Math.cos(t + k * 0.2) * 0.003;
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
     9. Custom Rangefinder / Viewfinder Cursor (Three.js WebGL + DOM Reticle)
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

      // 2. Project Portfolio Tiles — Signature "VIEW STORY" Viewfinder Reticle
      document.querySelectorAll('.g-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (!isTouch) cursorWrap.classList.add('hover-project');
        });
        el.addEventListener('mouseleave', function () {
          cursorWrap.classList.remove('hover-project');
        });
      });

      // 3. Visual gallery items and photography frames
      document.querySelectorAll('.insta-cell, .about-frame, .hc-frame').forEach(function (el) {
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
        curX += (targetX - curX) * 0.35;
        curY += (targetY - curY) * 0.35;

        cursorWrap.style.transform = 'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px, 0)';

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
     10. Master Initialization
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

