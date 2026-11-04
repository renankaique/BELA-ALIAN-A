// ==========================================================================
// BELA ALIANÇA ELÉTRICA E HIDRÁULICA — INTERATIVIDADE DO SITE E CARROSSEL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const swatchCards = document.querySelectorAll('.swatch-card');
  const toast = document.getElementById('copy-toast');
  const yearSpan = document.getElementById('current-year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Sombra no Header ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Menu Mobile
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ========================================================================
  // CARROSSEL DE 20 FOTOS (MATERIAIS ELÉTRICOS E HIDRÁULICOS)
  // ========================================================================
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const catBadge = document.getElementById('carousel-cat');
    const counter = document.getElementById('carousel-counter');
    const titleEl = document.getElementById('carousel-title');
    const descEl = document.getElementById('carousel-desc');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const progressBar = document.getElementById('carousel-progress-bar');

    const totalSlides = slides.length;
    const SLIDE_DURATION = 3200; // 3.2 segundos por foto
    let currentIndex = 0;
    let isPaused = false;
    let progressStart = performance.now();

    // Criar os 20 indicadores (dots)
    const dots = slides.map((slide, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Ver foto ${idx + 1}: ${slide.dataset.title || ''}`);
      dot.title = `${idx + 1}. ${slide.dataset.title || ''}`;
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
      return dot;
    });

    function goToSlide(index) {
      slides[currentIndex].classList.remove('active');
      if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

      currentIndex = (index + totalSlides) % totalSlides;

      const activeSlide = slides[currentIndex];
      activeSlide.classList.add('active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');

      if (catBadge) catBadge.textContent = activeSlide.dataset.category || '';
      if (counter) counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      if (titleEl) titleEl.textContent = activeSlide.dataset.title || '';
      if (descEl) descEl.textContent = activeSlide.dataset.desc || '';

      progressStart = performance.now();
      if (progressBar) progressBar.style.width = '0%';
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Pausar quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
      progressStart = performance.now();
    });

    // Suporte a gesto de arrastar (swipe) no celular
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });

    // Loop de animação contínua com barra de progresso
    function tick(now) {
      if (!isPaused) {
        const elapsed = now - progressStart;
        const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        if (progressBar) progressBar.style.width = `${pct}%`;

        if (elapsed >= SLIDE_DURATION) {
          goToSlide(currentIndex + 1);
        }
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ========================================================================
  // COPIAR CÓDIGO HEX DA PALETA DE CORES COM 1 CLIQUE
  // ========================================================================
  let toastTimeout;
  swatchCards.forEach((card) => {
    card.addEventListener('click', async () => {
      const hex = card.getAttribute('data-hex');
      if (!hex) return;

      try {
        await navigator.clipboard.writeText(hex);
      } catch {
        const tempInput = document.createElement('input');
        tempInput.value = hex;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      if (toast) {
        toast.textContent = `Cor ${hex} copiada para a área de transferência!`;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
        }, 2400);
      }
    });
  });
});
