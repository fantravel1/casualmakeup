/* ============================================================
   CasualMakeup.com — Main JavaScript
   Interactive elements, animations, navigation, routines
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // UTILITY: Detect current language from HTML lang attribute
  // ============================================================
  const lang = document.documentElement.lang || 'en';

  // ============================================================
  // SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
  // ============================================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // HEADER: Scroll behavior (glass effect + shadow)
  // ============================================================
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScroll = 0;
    var ticking = false;

    window.addEventListener('scroll', function () {
      lastScroll = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (lastScroll > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================================
  // MOBILE MENU TOGGLE
  // ============================================================
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // LANGUAGE SWITCHER DROPDOWN
  // ============================================================
  function initLanguageSwitcher() {
    var btn = document.querySelector('.lang-switcher__btn');
    var dropdown = document.querySelector('.lang-switcher__dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================
  // CHOOSE YOUR TIME — Interactive Routine Selector
  // ============================================================
  function initTimeSelector() {
    var timeButtons = document.querySelectorAll('.time-btn');
    var preview = document.getElementById('routine-preview');
    var previewTitle = document.getElementById('routine-preview-title');
    var stepsContainer = document.getElementById('routine-steps');
    if (!timeButtons.length || !preview || !stepsContainer) return;

    // Routine data — multilingual
    var routines = {
      en: {
        3: {
          title: 'The 3-Minute Face',
          steps: [
            { name: 'Tinted Moisturizer or Sunscreen', desc: 'Apply with fingers, blend quickly. Skip foundation entirely. 45 seconds.' },
            { name: 'Concealer', desc: 'Under eyes only. Tap with ring finger. 30 seconds.' },
            { name: 'Mascara + Lip Balm', desc: 'One quick coat of mascara. Swipe on tinted lip balm. Done. 45 seconds.' }
          ]
        },
        5: {
          title: 'The 5-Minute Face',
          steps: [
            { name: 'Tinted Moisturizer', desc: 'Dot on forehead, cheeks, nose, chin. Blend with fingers. 60 seconds.' },
            { name: 'Concealer', desc: 'Under eyes and any blemishes. Tap to blend with ring finger. 45 seconds.' },
            { name: 'Cream Blush', desc: 'Smile. Dab on apples of cheeks. Blend upward. 30 seconds.' },
            { name: 'Mascara', desc: 'One coat, upper lashes only. Wiggle from root to tip. 45 seconds.' },
            { name: 'Brow Gel + Lip Tint', desc: 'Brush brows up. Swipe on lip tint. Done. 60 seconds.' }
          ]
        },
        7: {
          title: 'The 7-Minute Face',
          steps: [
            { name: 'Primer or SPF', desc: 'Thin layer across face. Let it set for 15 seconds. 30 seconds.' },
            { name: 'Tinted Moisturizer', desc: 'Blend with damp sponge for smoother coverage. 60 seconds.' },
            { name: 'Concealer + Set', desc: 'Under eyes, nose, chin. Light dusting of powder on T-zone. 60 seconds.' },
            { name: 'Cream Blush + Bronzer', desc: 'Blush on cheeks. Touch of bronzer on temples and jawline. 60 seconds.' },
            { name: 'Brows', desc: 'Fill sparse areas with pencil or pomade. Set with brow gel. 60 seconds.' },
            { name: 'Mascara + Lips', desc: 'Two coats mascara. Apply lip liner and lip color. 60 seconds.' }
          ]
        },
        10: {
          title: 'The 10-Minute Face',
          steps: [
            { name: 'Skincare Prep', desc: 'Moisturizer + SPF. Let absorb while you prep products. 90 seconds.' },
            { name: 'Primer + Base', desc: 'Primer on T-zone. Tinted moisturizer or light foundation blended with sponge. 90 seconds.' },
            { name: 'Concealer + Setting', desc: 'Precise concealer placement. Set with translucent powder. 60 seconds.' },
            { name: 'Eyes — Shadow + Liner', desc: 'One wash of neutral shadow. Tight-line upper lash line. 90 seconds.' },
            { name: 'Blush + Bronzer + Highlight', desc: 'Cream blush, bronzer on hollows, dab of highlight on cheekbones. 60 seconds.' },
            { name: 'Brows', desc: 'Fill, shape, and set brows. The face-framing step. 60 seconds.' },
            { name: 'Mascara + Lips + Setting Spray', desc: 'Two coats mascara. Lip color of choice. Lock with setting spray. 60 seconds.' }
          ]
        }
      },
      es: {
        3: {
          title: 'El Rostro de 3 Minutos',
          steps: [
            { name: 'Crema Hidratante con Color o Protector Solar', desc: 'Aplica con los dedos, difumina rapido. Olvida la base por completo. 45 segundos.' },
            { name: 'Corrector', desc: 'Solo debajo de los ojos. Da toques con el dedo anular. 30 segundos.' },
            { name: 'Mascara + Balsamo Labial', desc: 'Una capa rapida de mascara. Aplica balsamo labial con color. Listo. 45 segundos.' }
          ]
        },
        5: {
          title: 'El Rostro de 5 Minutos',
          steps: [
            { name: 'Crema Hidratante con Color', desc: 'Puntos en frente, mejillas, nariz, menton. Difumina con los dedos. 60 segundos.' },
            { name: 'Corrector', desc: 'Debajo de los ojos y manchas. Da toques con el dedo anular. 45 segundos.' },
            { name: 'Rubor en Crema', desc: 'Sonrie. Aplica en las manzanas de las mejillas. Difumina hacia arriba. 30 segundos.' },
            { name: 'Mascara', desc: 'Una capa, solo pestanas superiores. Mueve desde la raiz a la punta. 45 segundos.' },
            { name: 'Gel de Cejas + Tinte Labial', desc: 'Cepilla las cejas hacia arriba. Aplica tinte labial. Listo. 60 segundos.' }
          ]
        },
        7: {
          title: 'El Rostro de 7 Minutos',
          steps: [
            { name: 'Primer o SPF', desc: 'Capa fina en todo el rostro. Deja asentar 15 segundos. 30 segundos.' },
            { name: 'Crema Hidratante con Color', desc: 'Difumina con esponja humeda para mejor cobertura. 60 segundos.' },
            { name: 'Corrector + Sellado', desc: 'Debajo de ojos, nariz, menton. Polvo ligero en zona T. 60 segundos.' },
            { name: 'Rubor en Crema + Bronceador', desc: 'Rubor en mejillas. Toque de bronceador en sienes y mandibula. 60 segundos.' },
            { name: 'Cejas', desc: 'Rellena areas despobladas con lapiz o pomada. Fija con gel. 60 segundos.' },
            { name: 'Mascara + Labios', desc: 'Dos capas de mascara. Aplica delineador y color de labios. 60 segundos.' }
          ]
        },
        10: {
          title: 'El Rostro de 10 Minutos',
          steps: [
            { name: 'Preparacion de Piel', desc: 'Hidratante + SPF. Deja absorber mientras preparas productos. 90 segundos.' },
            { name: 'Primer + Base', desc: 'Primer en zona T. Crema con color o base ligera con esponja. 90 segundos.' },
            { name: 'Corrector + Sellado', desc: 'Corrector preciso. Sella con polvo traslucido. 60 segundos.' },
            { name: 'Ojos — Sombra + Delineador', desc: 'Una sombra neutra. Delinea la linea superior de pestanas. 90 segundos.' },
            { name: 'Rubor + Bronceador + Iluminador', desc: 'Rubor en crema, bronceador en huesos, toque de iluminador en pomulos. 60 segundos.' },
            { name: 'Cejas', desc: 'Rellena, da forma y fija las cejas. El paso que enmarca el rostro. 60 segundos.' },
            { name: 'Mascara + Labios + Spray Fijador', desc: 'Dos capas de mascara. Color de labios. Fija con spray. 60 segundos.' }
          ]
        }
      },
      fr: {
        3: {
          title: 'Le Visage en 3 Minutes',
          steps: [
            { name: 'Creme Teintee ou Protection Solaire', desc: 'Appliquez du bout des doigts, estompez rapidement. Oubliez le fond de teint. 45 secondes.' },
            { name: 'Correcteur', desc: 'Sous les yeux uniquement. Tapotez avec l\'annulaire. 30 secondes.' },
            { name: 'Mascara + Baume a Levres', desc: 'Une couche rapide de mascara. Appliquez un baume teinte. Termine. 45 secondes.' }
          ]
        },
        5: {
          title: 'Le Visage en 5 Minutes',
          steps: [
            { name: 'Creme Teintee', desc: 'Points sur le front, joues, nez, menton. Estompez avec les doigts. 60 secondes.' },
            { name: 'Correcteur', desc: 'Sous les yeux et imperfections. Tapotez avec l\'annulaire. 45 secondes.' },
            { name: 'Blush Creme', desc: 'Souriez. Appliquez sur les pommettes. Estompez vers le haut. 30 secondes.' },
            { name: 'Mascara', desc: 'Une couche, cils superieurs uniquement. De la racine a la pointe. 45 secondes.' },
            { name: 'Gel Sourcils + Teinte Levres', desc: 'Brossez les sourcils vers le haut. Appliquez la teinte. Termine. 60 secondes.' }
          ]
        },
        7: {
          title: 'Le Visage en 7 Minutes',
          steps: [
            { name: 'Base ou SPF', desc: 'Fine couche sur tout le visage. Laissez poser 15 secondes. 30 secondes.' },
            { name: 'Creme Teintee', desc: 'Estompez avec une eponge humide pour un fini plus lisse. 60 secondes.' },
            { name: 'Correcteur + Fixation', desc: 'Sous les yeux, nez, menton. Leger voile de poudre sur la zone T. 60 secondes.' },
            { name: 'Blush Creme + Bronzer', desc: 'Blush sur les joues. Touche de bronzer sur les tempes et la machoire. 60 secondes.' },
            { name: 'Sourcils', desc: 'Remplissez les zones clairsemees au crayon ou pommade. Fixez au gel. 60 secondes.' },
            { name: 'Mascara + Levres', desc: 'Deux couches de mascara. Appliquez crayon a levres et couleur. 60 secondes.' }
          ]
        },
        10: {
          title: 'Le Visage en 10 Minutes',
          steps: [
            { name: 'Preparation de la Peau', desc: 'Hydratant + SPF. Laissez absorber pendant que vous preparez. 90 secondes.' },
            { name: 'Base + Teint', desc: 'Base sur la zone T. Creme teintee ou fond de teint leger a l\'eponge. 90 secondes.' },
            { name: 'Correcteur + Fixation', desc: 'Application precise du correcteur. Fixez avec poudre translucide. 60 secondes.' },
            { name: 'Yeux — Fard + Liner', desc: 'Un fard neutre en aplat. Tracez le ras de cils superieur. 90 secondes.' },
            { name: 'Blush + Bronzer + Highlighter', desc: 'Blush creme, bronzer dans les creux, touche de highlighter sur les pommettes. 60 secondes.' },
            { name: 'Sourcils', desc: 'Remplissez, dessinez et fixez les sourcils. L\'etape qui structure le visage. 60 secondes.' },
            { name: 'Mascara + Levres + Spray Fixateur', desc: 'Deux couches mascara. Couleur a levres. Fixez au spray. 60 secondes.' }
          ]
        }
      }
    };

    // Get routines for current language (fallback to English)
    var currentRoutines = routines[lang] || routines['en'];

    function renderRoutine(time) {
      var routine = currentRoutines[time];
      if (!routine) return;

      previewTitle.textContent = routine.title;
      stepsContainer.innerHTML = '';

      routine.steps.forEach(function (step, i) {
        var stepEl = document.createElement('div');
        stepEl.className = 'routine-step';
        stepEl.innerHTML =
          '<div class="routine-step__number">' + (i + 1) + '</div>' +
          '<div class="routine-step__content">' +
          '<h4>' + step.name + '</h4>' +
          '<p>' + step.desc + '</p>' +
          '</div>';
        stepsContainer.appendChild(stepEl);
      });

      preview.classList.add('visible');
      preview.style.display = 'block';
    }

    timeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Remove active from all
        timeButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var time = parseInt(btn.getAttribute('data-time'), 10);
        renderRoutine(time);
      });
    });

    // Show default (5-minute)
    renderRoutine(5);
  }

  // ============================================================
  // PRODUCT FINDER — Search Suggestions
  // ============================================================
  function initProductFinder() {
    var searchInput = document.querySelector('.finder-search__input');
    var tags = document.querySelectorAll('.finder-tag');
    if (!searchInput) return;

    tags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        searchInput.value = tag.textContent;
        searchInput.focus();
        // Animate the tag
        tag.style.background = 'var(--color-accent)';
        tag.style.borderColor = 'var(--color-accent)';
        tag.style.color = 'var(--color-white)';
        setTimeout(function () {
          tag.style.background = '';
          tag.style.borderColor = '';
          tag.style.color = '';
        }, 1500);
      });
    });

    // Search input animation
    searchInput.addEventListener('focus', function () {
      searchInput.parentElement.style.transform = 'scale(1.02)';
    });
    searchInput.addEventListener('blur', function () {
      searchInput.parentElement.style.transform = 'scale(1)';
    });
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerHeight = document.querySelector('.site-header').offsetHeight || 70;
          var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================
  // COUNTER ANIMATION for hero stats
  // ============================================================
  function initCounterAnimations() {
    var stats = document.querySelectorAll('.hero__stat-number');
    if (!stats.length) return;

    var animated = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          stats.forEach(function (stat) {
            animateCounter(stat);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.hero__stats');
    if (statsSection) observer.observe(statsSection);
  }

  function animateCounter(el) {
    var text = el.textContent.trim();
    var hasPlus = text.includes('+');
    var hasPercent = text.includes('%');
    var num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return;

    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * num);
      el.textContent = current + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = num + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
      }
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // SITUATION CARDS — Hover parallax effect
  // ============================================================
  function initSituationCards() {
    var cards = document.querySelectorAll('.situation-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var img = card.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1.08) translate(' +
            ((x - 0.5) * -10) + 'px, ' +
            ((y - 0.5) * -10) + 'px)';
        }
      });
      card.addEventListener('mouseleave', function () {
        var img = card.querySelector('img');
        if (img) {
          img.style.transform = '';
        }
      });
    });
  }

  // ============================================================
  // GALLERY — Lightbox-style hover info
  // ============================================================
  function initGallery() {
    var items = document.querySelectorAll('.gallery-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (!img) return;
        // Toggle enlarged view
        item.classList.toggle('gallery-item--expanded');
      });
    });
  }

  // ============================================================
  // FINDER CATEGORIES — Keyboard accessibility
  // ============================================================
  function initFinderCategories() {
    var categories = document.querySelectorAll('.finder-category');
    categories.forEach(function (cat) {
      cat.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cat.click();
        }
      });
    });
  }

  // ============================================================
  // NEWSLETTER FORM — Basic client-side handling
  // ============================================================
  function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    if (!form) return;

    var messages = {
      en: { success: 'Welcome! Check your inbox for your first casual beauty tip.', error: 'Please enter a valid email address.' },
      es: { success: 'Bienvenida! Revisa tu correo para tu primer consejo de belleza casual.', error: 'Por favor ingresa un correo electronico valido.' },
      fr: { success: 'Bienvenue ! Consultez votre boite mail pour votre premier conseil beaute.', error: 'Veuillez entrer une adresse email valide.' }
    };

    var msg = messages[lang] || messages['en'];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button');
      if (!input || !input.value) return;

      // Basic email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.style.borderColor = '#ff6b6b';
        input.setAttribute('aria-invalid', 'true');
        return;
      }

      // Simulate submission
      btn.textContent = '...';
      btn.disabled = true;

      setTimeout(function () {
        input.value = '';
        btn.textContent = msg.success;
        btn.style.background = 'var(--color-success)';
        btn.style.color = 'var(--color-white)';

        setTimeout(function () {
          btn.textContent = lang === 'es' ? 'Suscribirse' : lang === 'fr' ? 'S\'abonner' : 'Subscribe';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      }, 800);
    });
  }

  // ============================================================
  // TOOL CARDS — Interactive hover feedback
  // ============================================================
  function initToolCards() {
    var cards = document.querySelectorAll('.tool-card');
    cards.forEach(function (card) {
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ============================================================
  // ACTIVE NAV HIGHLIGHTING on scroll
  // ============================================================
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.main-nav a');
    if (!sections.length || !navLinks.length) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollPos = window.scrollY + 150;
          sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
              navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                  link.classList.add('active');
                }
              });
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================================
  // LAZY LOADING IMAGES (native + fallback)
  // ============================================================
  function initLazyLoading() {
    // If native lazy loading isn't supported, use IntersectionObserver
    if ('loading' in HTMLImageElement.prototype) return;

    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function (img) {
      observer.observe(img);
    });
  }

  // ============================================================
  // INITIALIZE ALL
  // ============================================================
  function init() {
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initLanguageSwitcher();
    initTimeSelector();
    initProductFinder();
    initSmoothScroll();
    initCounterAnimations();
    initSituationCards();
    initGallery();
    initFinderCategories();
    initNewsletter();
    initToolCards();
    initNavHighlight();
    initLazyLoading();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
