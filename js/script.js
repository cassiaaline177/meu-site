// ========== MENU MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  menuToggle?.addEventListener('click', function(e) {
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
});

// ========== LIGHTBOX ==========
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const imgLightbox = document.getElementById('img-lightbox');
  const galeriaImgs = document.querySelectorAll('.galeria-item img');

  galeriaImgs.forEach(img => {
    img.addEventListener('click', function() {
      imgLightbox.src = this.src;
      imgLightbox.alt = this.alt;
      lightbox.classList.add('active');
    });
  });

  // Fechar ao clicar no fundo (não na imagem)
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    }
  });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
