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
    document.querySelectorAll('nav a').forEach(link => {
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

  if (lightbox && imgLightbox && galeriaItems.length > 0) {
    galeriaItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
          imgLightbox.src = img.src;
          imgLightbox.alt = img.alt;
          lightbox.classList.add('active');
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };

    // Fechar ao clicar no fundo (não na imagem)
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
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

  // ========== FORMULÁRIO DE CONTATO ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulação de envio visual
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      
      btn.innerText = 'Enviando...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
        btn.innerText = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
      }, 1500);
    });
  }
});
