document.addEventListener('DOMContentLoaded', function () {

  // ========== MENU MOBILE ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  const body = document.body;

  if (menuToggle && menu) {

    function openMenu() {
      menu.classList.add('active');
      body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('active');
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      // Fecha todos os dropdowns abertos
      menu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }

    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.contains('active') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('active')) return;
      if (menuToggle.contains(e.target)) return;
      if (!menu.contains(e.target) || e.target.closest('a') || e.target.closest('.close-menu-btn')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Adiciona a "armadilha de foco" (Focus Trap)
    menu.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      const focusableElements = menu.querySelectorAll('a[href], button:not([disabled])');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });

    // ========== DROPDOWN MOBILE TOGGLE ==========
    // No mobile, o hover não funciona — usamos clique no .dropbtn para abrir/fechar
    menu.querySelectorAll('.dropdown .dropbtn').forEach(function (dropbtn) {
      dropbtn.addEventListener('click', function (e) {
        // Só aplica o toggle se estiver em modo mobile
        if (window.innerWidth <= 768) { // Ação para mobile

        e.preventDefault();
        e.stopPropagation();

        const parentDropdown = this.closest('.dropdown');
        const isOpen = parentDropdown.classList.contains('open');

        // Fecha todos os outros dropdowns abertos
        menu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));

        // Abre o atual (se não estava aberto) e atualiza o ARIA
        if (!isOpen) {
          parentDropdown.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
        } // Fim da condição mobile
      });
    });
  }

  // ========== LIGHTBOX ==========
  const lightbox = document.getElementById('lightbox');
  const imgLightbox = document.getElementById('img-lightbox');
  const galeriaItems = document.querySelectorAll('.galeria-item');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  const images = Array.from(galeriaItems).map(item => item.querySelector('img'));

  if (lightbox && imgLightbox && galeriaItems.length > 0) {

    const updateImage = (index) => {
      if (index >= 0 && index < images.length) {
        const img = images[index];
        imgLightbox.src = img.src;
        imgLightbox.alt = img.alt;
        currentIndex = index;
      }
    };

    galeriaItems.forEach((item, index) => {
      item.addEventListener('click', function () {
        updateImage(index);
        lightbox.classList.add('active');
      });
    });

    const showNext = (e) => {
      if (e) e.stopPropagation();
      updateImage(currentIndex + 1 >= images.length ? 0 : currentIndex + 1);
    };

    const showPrev = (e) => {
      if (e) e.stopPropagation();
      updateImage(currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1);
    };

    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    const closeLightbox = () => lightbox.classList.remove('active');

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  }

  // ========== GALLERY FILTER ==========
  const filterButtons = document.querySelectorAll('.filtro-btn');
  const galleryItems = document.querySelectorAll('.galeria-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const filterValue = this.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          item.style.display = (filterValue === 'all' || filterValue === itemCategory) ? 'block' : 'none';
        });
      });
    });
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !document.querySelector(href)) return;
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ========== SCROLL ANIMATION ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.sobre-texto, .sobre-img, .roteiros-section h2, .secao-descricao, .roteiro-card')
    .forEach((el) => observer.observe(el));

  // ========== FORMULÁRIO DE CONTATO (AJAX) ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerText;

      btn.innerText = 'Enviando...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            const formContainer = document.querySelector('.contato-form-col');
            formContainer.innerHTML = `
              <div style="text-align: center; padding: 30px 20px;">
                <div style="font-size: 4rem; margin-bottom: 15px;">✅</div>
                <h3 style="color: var(--azul); margin-bottom: 10px;">Mensagem Enviada com Sucesso!</h3>
                <p style="color: var(--text-color); font-size: 1.1rem;">Agradecemos seu contato. Em breve retornaremos!</p>
              </div>
            `;
          } else {
            alert('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
        })
        .finally(() => {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
        });
    });
  }

  // ========== CAROUSEL PARCERIAS ==========
  const track = document.getElementById('track');
  if (track) {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const dotsContainer = document.getElementById('dotsContainer');
    const cards = document.querySelectorAll('.sponsor-card');

    let carouselIndex = 0;
    const totalItems = cards.length;
    let autoPlayInterval;

    function getVisibleItems() {
      if (window.innerWidth <= 600) return 2;
      if (window.innerWidth <= 992) return 3;
      return 5;
    }

    function updateCarousel() {
      const visibleItems = getVisibleItems();
      const cardWidth = track.offsetWidth / visibleItems;
      const maxIndex = totalItems - visibleItems;

      if (carouselIndex > maxIndex) carouselIndex = 0;
      if (carouselIndex < 0) carouselIndex = maxIndex;

      track.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
      updateDots();
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const visibleItems = getVisibleItems();
      const maxIndex = totalItems - visibleItems;

      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === carouselIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          carouselIndex = i;
          updateCarousel();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === carouselIndex);
      });
    }

    function moveNext() { carouselIndex++; updateCarousel(); }
    function movePrev() { carouselIndex--; updateCarousel(); }

    if (btnNext) btnNext.addEventListener('click', () => { moveNext(); resetAutoPlay(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { movePrev(); resetAutoPlay(); });

    function startAutoPlay() { autoPlayInterval = setInterval(moveNext, 3000); }
    function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }

    window.addEventListener('resize', () => { createDots(); updateCarousel(); });

    createDots();
    startAutoPlay();
  }

  // ========== COOKIE CONSENT (LGPD) ==========
  if (!localStorage.getItem('cookieConsent')) {
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.innerHTML = `
      <div class="cookie-content">
        <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>
      </div>
      <button id="accept-cookies" class="btn">Aceitar</button>
    `;
    document.body.appendChild(cookieBanner);

    setTimeout(() => cookieBanner.classList.add('show'), 1000);

    const acceptBtn = document.getElementById('accept-cookies');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('show');
        setTimeout(() => cookieBanner.remove(), 500);
      });
    }
  }

  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 300);
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});