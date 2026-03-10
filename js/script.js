document.addEventListener('DOMContentLoaded', function() {

  // ========== MENU MOBILE ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  const body = document.body;
  const closeMenuBtn = document.querySelector('.close-menu-btn');

  if (menuToggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('active');
      body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('active');
      body.classList.toggle('menu-open');
    });

    // Lógica unificada para fechar o menu
    document.addEventListener('click', function(e) {
      // Só faz algo se o menu estiver ativo
      if (!menu.classList.contains('active')) return;

      // Não fecha se o clique foi no próprio botão de abrir/fechar
      if (e.target.closest('.menu-toggle')) return;

      // Fecha se o clique foi fora do menu, em um link, ou no botão de fechar
      if (!e.target.closest('nav') || e.target.closest('nav a') || e.target.closest('.close-menu-btn')) {
        closeMenu();
      }
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
  // Cria um array com todas as imagens da galeria para facilitar a navegação
  const images = Array.from(galeriaItems).map(item => item.querySelector('img'));

  if (lightbox && imgLightbox && galeriaItems.length > 0) {
    
    // Função para atualizar a imagem do lightbox baseada no índice
    const updateImage = (index) => {
      if (index >= 0 && index < images.length) {
        const img = images[index];
        imgLightbox.src = img.src;
        imgLightbox.alt = img.alt;
        currentIndex = index;
      }
    };

    // Abrir lightbox ao clicar na imagem
    galeriaItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        updateImage(index);
        lightbox.classList.add('active');
      });
    });

    // Navegação Próxima
    const showNext = (e) => {
      if (e) e.stopPropagation();
      let newIndex = currentIndex + 1;
      if (newIndex >= images.length) newIndex = 0; // Loop para o início
      updateImage(newIndex);
    };

    // Navegação Anterior
    const showPrev = (e) => {
      if (e) e.stopPropagation();
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = images.length - 1; // Loop para o final
      updateImage(newIndex);
    };

    // Event Listeners dos botões
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };

    // Fechar ao clicar no fundo (não na imagem)
    lightbox.addEventListener('click', function(e) {
      // Fecha se clicar fora da imagem e fora dos botões de navegação
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Navegação por teclado (ESC, Seta Esquerda, Seta Direita)
    document.addEventListener('keydown', function(e) {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });

    // Fechar no botão X
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }
  }

  // ========== GALLERY FILTER ==========
  const filterButtons = document.querySelectorAll('.filtro-btn');
  const galleryItems = document.querySelectorAll('.galeria-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Set active button state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
  }, {
    threshold: 0.1 // Trigger when 10% of the element is visible
  });

  const animatedElements = document.querySelectorAll('.sobre-texto, .sobre-img, .roteiros-section h2, .secao-descricao, .roteiro-card');
  animatedElements.forEach((el) => observer.observe(el));

  // ========== FORMULÁRIO DE CONTATO (AJAX) ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      
      btn.innerText = 'Enviando...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
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
    
    let currentIndex = 0;
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
      
      if (currentIndex > maxIndex) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex;

      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots(visibleItems);
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const visibleItems = getVisibleItems();
      const maxIndex = totalItems - visibleItems;
      
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          resetAutoPlay();
        });
        
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function moveNext() {
      currentIndex++;
      updateCarousel();
    }

    function movePrev() {
      currentIndex--;
      updateCarousel();
    }

    if (btnNext) btnNext.addEventListener('click', () => { moveNext(); resetAutoPlay(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { movePrev(); resetAutoPlay(); });

    function startAutoPlay() {
      autoPlayInterval = setInterval(moveNext, 3000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });

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
    
    // Delay para animação de entrada suave
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);

    const acceptBtn = document.getElementById('accept-cookies');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('show');
        setTimeout(() => {
          cookieBanner.remove();
        }, 500); // Aguarda a transição CSS terminar antes de remover do DOM
      });
    }
  }

  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});