document.addEventListener('DOMContentLoaded', function() {

  // ========== MENU MOBILE ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('nav a:not(.dropbtn)').forEach(link => {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
        menu.classList.remove('active');
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

  const animatedElements = document.querySelectorAll('.sobre-texto, .sobre-img, .roteiros-section h2, .secao-descricao');
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
          // Substitui o conteúdo do container do formulário pela mensagem
          const formContainer = document.querySelector('.form-container');
          formContainer.innerHTML = `
            <div style="text-align: center; padding: 30px 20px;">
              <div style="font-size: 4rem; margin-bottom: 15px;">✅</div>
              <h3 style="color: var(--azul); margin-bottom: 10px;">Mensagem Enviada!</h3>
              <p style="color: #555; font-size: 1.1rem;">Obrigado pelo contato. Recebemos sua mensagem e retornaremos em breve.</p>
              <button onclick="location.reload()" class="btn" style="margin-top: 25px;">Enviar nova mensagem</button>
            </div>
          `;
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('Ocorreu um erro ao enviar. Tente novamente.');
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      })
      .catch(error => {
        alert('Erro de conexão. Verifique sua internet.');
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    });
  }
});
