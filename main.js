/**
 * Intelligence Designed To Evolve - Frontier Tech & Innovation Platform
 * Vanilla JavaScript: Era Timeline Video Switcher, Scroll Animations, Stats Counter, Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initEraTimeline();
  initScrollAnimations();
  initScrollProgressBar();
  initMobileMenu();
  initStatsCounter();
  initInteractiveFilters();
  initArchitectureSwitcher();
  initContactTierSelector();
  initFormHandlers();
  initSignInModal();
});

/**
 * Era Timeline & Dynamic Background Video Cross-Fader
 * Switches background video per era and auto-reverts to original background when scrolling above the timeline
 */
function initEraTimeline() {
  const eraButtons = document.querySelectorAll('.era-btn');
  const eraPanels = document.querySelectorAll('.era-panel');
  const videoA = document.getElementById('bg-video-a');
  const videoB = document.getElementById('bg-video-b');
  const badgeText = document.getElementById('era-badge-text');
  const playBtn = document.getElementById('era-video-play-btn');
  const muteBtn = document.getElementById('era-video-mute-btn');
  const timelineSection = document.getElementById('timeline');
  const headerWrapper = document.querySelector('.header-wrapper');

  if (!videoA || !videoB) return;

  // Complete, verified 5-era video matrix (MP4 h.264 yuv420p for instant, cross-browser playback)
  const eraVideos = {
    'era-1970': {
      url: '/assets/silicon-pc-1980.mp4',
      title: '1970–1989 // Personal Computer & Silicon Dawn',
      tag: 'C64 Silicon Broadcast',
    },
    'era-1990': {
      url: '/assets/web-highway-1990.mp4',
      title: '1990–1999 // The World Wide Web & Global Highway',
      tag: 'Global Packet Highway',
    },
    'era-2000': {
      url: '/assets/steve-jobs-2007.mp4',
      title: '2000–2010 // Steve Jobs iPhone Keynote Broadcast',
      tag: 'Macworld 2007 Keynote',
    },
    'era-2011': {
      url: '/assets/autonomous-ai-2015.mp4',
      title: '2011–2020 // Deep Learning & Autonomous Robotics',
      tag: 'Neural Autonomous Core',
    },
    'era-2021': {
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4',
      title: '2021–Present // Frontier Generative Cognitive Core',
      tag: 'Neural Synthesis Loop',
    },
  };

  let activeVideoEl = videoA;
  let inactiveVideoEl = videoB;
  let currentEraKey = 'era-2021';
  let userSelectedEra = 'era-2021';
  let isAboveTimeline = true;

  function crossfadeToVideo(eraKey) {
    if (eraKey === currentEraKey) return;
    const config = eraVideos[eraKey];
    if (!config) return;

    currentEraKey = eraKey;

    // Load and play on the inactive video element
    inactiveVideoEl.src = config.url;
    inactiveVideoEl.currentTime = 0;
    inactiveVideoEl.muted = true;
    inactiveVideoEl.loop = true;

    // Start playback immediately
    const playPromise = inactiveVideoEl.play();

    // Trigger visual crossfade
    inactiveVideoEl.classList.add('active-video');
    activeVideoEl.classList.remove('active-video');

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Video playback notice:', err);
      });
    }

    // Clean up previous video after CSS opacity transition completes
    setTimeout(() => {
      activeVideoEl.pause();
      const temp = activeVideoEl;
      activeVideoEl = inactiveVideoEl;
      inactiveVideoEl = temp;
    }, 700);

    if (badgeText) {
      badgeText.innerHTML = `<span class="era-video-badge-tag">${config.tag}:</span> ${config.title}`;
    }
  }

  function selectEra(eraKey, triggerVideo = true) {
    userSelectedEra = eraKey;
    isAboveTimeline = false;

    eraButtons.forEach((btn) => {
      if (btn.getAttribute('data-era') === eraKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    eraPanels.forEach((panel) => {
      if (panel.id === eraKey) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (triggerVideo) {
      crossfadeToVideo(eraKey);
    }
  }

  eraButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eraKey = btn.getAttribute('data-era');
      if (eraKey) selectEra(eraKey, true);
    });
  });

  // Scroll detection: When user scrolls above Innovations Around Us, auto-revert to original background video
  function checkScrollPosition() {
    // Liquid glass header sticky blur enhancement
    if (headerWrapper) {
      if (window.scrollY > 20) {
        headerWrapper.classList.add('is-scrolled');
      } else {
        headerWrapper.classList.remove('is-scrolled');
      }
    }

    if (!timelineSection) return;

    const rect = timelineSection.getBoundingClientRect();
    // Timeline section top relative to viewport
    // If timeline top is below 40% of viewport, user is above it in Hero/Stats
    if (rect.top > window.innerHeight * 0.45) {
      if (!isAboveTimeline) {
        isAboveTimeline = true;
        // Revert to original background video
        crossfadeToVideo('era-2021');
      }
    } else if (rect.bottom > 100) {
      // User is viewing the timeline section
      if (isAboveTimeline) {
        isAboveTimeline = false;
        // Switch to the selected era video
        crossfadeToVideo(userSelectedEra);
      }
    }
  }

  window.addEventListener('scroll', checkScrollPosition, { passive: true });
  checkScrollPosition();

  // Media Controls for the Background Video
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (activeVideoEl.paused) {
        activeVideoEl.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        activeVideoEl.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (activeVideoEl.muted) {
        activeVideoEl.muted = false;
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      } else {
        activeVideoEl.muted = true;
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    });
  }
}

/**
 * Scroll Progress Bar
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${Math.min(scrolled, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  const benchmarkFills = document.querySelectorAll('.benchmark-fill');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
    benchmarkFills.forEach((fill) => {
      const targetWidth = fill.getAttribute('data-width') || '100%';
      fill.style.width = targetWidth;
    });
    return;
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');

            // If entry contains benchmark bars, trigger their animation
            const fills = entry.target.querySelectorAll ? entry.target.querySelectorAll('.benchmark-fill') : [];
            fills.forEach((fill) => {
              const targetWidth = fill.getAttribute('data-width') || '100%';
              fill.style.width = targetWidth;
            });

            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileSheet = document.querySelector('.mobile-sheet');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-sheet a');

  if (!burgerBtn || !mobileSheet || !mobileOverlay) return;

  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close navigation menu');
    mobileOverlay.hidden = false;
    mobileSheet.hidden = false;
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    isMenuOpen = false;
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open navigation menu');
    mobileOverlay.hidden = true;
    mobileSheet.hidden = true;
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  burgerBtn.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
      burgerBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && isMenuOpen) {
      closeMenu();
    }
  });
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats');
  const statElements = document.querySelectorAll('.stat-value');

  if (!statsSection || statElements.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatValue(value, decimals, suffix) {
    return value.toFixed(decimals) + suffix;
  }

  function runCounter() {
    statElements.forEach((el, index) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1500 + index * 80;
      const startOffset = 480 + index * 90;

      if (prefersReducedMotion) {
        el.textContent = formatValue(target, decimals, suffix);
        return;
      }

      setTimeout(() => {
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentEased = easeOutCubic(progress);
          const currentVal = currentEased * target;

          el.textContent = formatValue(currentVal, decimals, suffix);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = formatValue(target, decimals, suffix);
          }
        }

        requestAnimationFrame(step);
      }, startOffset);
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(statsSection);
  } else {
    runCounter();
  }
}

/**
 * Interactive Filters for Radar / Case Studies
 */
function initInteractiveFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length === 0) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.filter-tabs');
      if (parent) {
        parent.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      }
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');
      const targetItems = document.querySelectorAll('.filterable-item');

      targetItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px) scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * Interactive Architecture Diagram / Stream Switcher
 */
function initArchitectureSwitcher() {
  const archButtons = document.querySelectorAll('.arch-tab-btn');
  if (archButtons.length === 0) return;

  const archDisplays = document.querySelectorAll('.arch-display-panel');

  archButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      archButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      archDisplays.forEach((panel) => {
        if (panel.id === targetId) {
          panel.style.display = 'block';
          panel.style.opacity = '0';
          setTimeout(() => {
            panel.style.opacity = '1';
          }, 20);
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Contact Tier Selection
 */
function initContactTierSelector() {
  const tierCards = document.querySelectorAll('.tier-card');
  const tierInput = document.getElementById('selected-tier-input');

  if (tierCards.length === 0) return;

  tierCards.forEach((card) => {
    card.addEventListener('click', () => {
      tierCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      const tierValue = card.getAttribute('data-tier');
      if (tierInput) {
        tierInput.value = tierValue || '';
      }
    });
  });
}

/**
 * Interactive Form Submissions
 */
function initFormHandlers() {
  const accessForm = document.getElementById('request-access-form');
  const statusNotice = document.getElementById('form-status-notice');

  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = accessForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Allocating Sovereign Enclave...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Allocation Granted';
        }

        if (statusNotice) {
          statusNotice.hidden = false;
          statusNotice.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #a7f3d0; padding: 14px 18px; border-radius: 14px; font-size: 13.5px; margin-top: 16px;">
              <strong>Sandbox Access Initialized:</strong> A dedicated verification token and quantum mesh keys have been routed to your enterprise gateway.
            </div>
          `;
        }

        accessForm.reset();
      }, 1200);
    });
  }
}

/**
 * Sign In Modal
 */
function initSignInModal() {
  const signInBtns = document.querySelectorAll('.sign-in-btn, a[href="#sign-in"]');
  const modalOverlay = document.getElementById('sign-in-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  if (!modalOverlay) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modalOverlay.hidden = false;
    document.body.classList.add('menu-open');
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.classList.remove('menu-open');
  }

  signInBtns.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) {
      closeModal();
    }
  });
}
