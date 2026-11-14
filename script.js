// ==========================================================================
// BELA ALIANÇA ELÉTRICA E HIDRÁULICA — INTERATIVIDADE DO SITE E CARROSSEL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const yearSpan = document.getElementById('current-year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Alternar Tema Claro / Escuro (com salvamento automático)
  if (localStorage.getItem('bela_theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('bela_theme', isDark ? 'dark' : 'light');
    });
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
  // REVELAR BOTÃO WHATSAPP AO PASSAR O MOUSE OU CLICAR NO CARD (MOBILE/DESKTOP)
  // ========================================================================
  const offersGrid = document.getElementById('offers-grid');

  // Delegação de clique nos cards de oferta (funciona também para ofertas vindas do Firebase)
  if (offersGrid) {
    offersGrid.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const card = e.target.closest('.offer-card');
      if (!card) return;

      const wasActive = card.classList.contains('active-card');
      offersGrid.querySelectorAll('.offer-card').forEach((c) => c.classList.remove('active-card'));
      if (!wasActive) card.classList.add('active-card');
    });
  }

  // Fechar card de oferta ativo ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.offer-card') && offersGrid) {
      offersGrid.querySelectorAll('.offer-card').forEach((c) => c.classList.remove('active-card'));
    }
  });

  // ========================================================================
  // FILTRO POR CATEGORIA + SINCRONIZAÇÃO COM FIREBASE / MODO LOCAL
  // ========================================================================
  const offerTabs = document.querySelectorAll('.offer-tab');
  let activeFilter = 'all';

  function applyOfferFilter(filter) {
    activeFilter = filter || 'all';
    if (!offersGrid) return;

    const cards = offersGrid.querySelectorAll('.offer-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      const rawCat = card.getAttribute('data-category');
      const normalized = window.BelaUtils ? window.BelaUtils.normalizeCategory(rawCat) : rawCat;
      const normalizedFilter =
        activeFilter === 'all'
          ? 'all'
          : window.BelaUtils
            ? window.BelaUtils.normalizeCategory(activeFilter)
            : activeFilter;

      if (normalizedFilter === 'all' || normalized === normalizedFilter) {
        card.classList.remove('hidden-offer');
        visibleCount++;
      } else {
        card.classList.add('hidden-offer');
      }
    });

    // Mensagem amigável se uma categoria específica ainda não tiver ofertas nesta semana
    const existingEmpty = offersGrid.querySelector('.offers-empty-state');
    if (existingEmpty) existingEmpty.remove();

    if (cards.length > 0 && visibleCount === 0) {
      const catLabel =
        window.BelaUtils && activeFilter !== 'all'
          ? window.BelaUtils.getCategoryMeta(activeFilter).label
          : 'esta categoria';
      const emptyEl = document.createElement('div');
      emptyEl.className = 'offers-empty-state';
      emptyEl.innerHTML = `
        <p>Nenhuma promoção cadastrada em <strong>${window.BelaUtils ? window.BelaUtils.escapeHTML(catLabel) : catLabel}</strong> no momento.</p>
        <a href="https://wa.me/5561999945097?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20ofertas%20em%20${encodeURIComponent(catLabel)}!" target="_blank" rel="noopener" class="btn btn-primary">
          Consultar Preços no WhatsApp
        </a>
      `;
      offersGrid.appendChild(emptyEl);
    }
  }

  offerTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter') || 'all';
      offerTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      applyOfferFilter(filter);
    });
  });

  function renderOffersToGrid(offersList) {
    if (!offersGrid || !window.BelaUtils) return;

    const normalizedList = (offersList || []).map((row) => window.BelaUtils.normalizeOfferRow(row));
    const activeOffers = normalizedList
      .filter((item) => item && item.ativo !== false)
      .sort((a, b) => {
        const destA = a.destaque ? 1 : 0;
        const destB = b.destaque ? 1 : 0;
        if (destA !== destB) return destB - destA;
        const ordA = Number(a.ordem || 999);
        const ordB = Number(b.ordem || 999);
        if (ordA !== ordB) return ordA - ordB;
        return Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0);
      });

    if (activeOffers.length === 0) {
      offersGrid.innerHTML = `
        <div class="offers-empty-state">
          <p>Novas ofertas da semana estão sendo preparadas pela nossa equipe!</p>
          <a href="https://wa.me/5561999945097?text=Ol%C3%A1!%20Quero%20saber%20as%20ofertas%20de%20hoje%20da%20Bela%20Alian%C3%A7a!" target="_blank" rel="noopener" class="btn btn-primary">
            Consultar Ofertas no WhatsApp
          </a>
        </div>
      `;
      return;
    }

    offersGrid.innerHTML = activeOffers.map((offer) => window.BelaUtils.buildOfferCardHTML(offer, true)).join('');
    applyOfferFilter(activeFilter);
  }

  // Conectar ao Supabase (Vercel / Config) ou carregar Modo Local
  async function syncOffersFromStore() {
    if (!offersGrid || !window.BelaUtils) return;

    const sb = await window.BelaUtils.initSupabase();
    if (sb.configured && sb.client) {
      const fetchOffers = async () => {
        const { data, error } = await sb.client.from('ofertas').select('*');
        if (error) {
          console.warn('Erro ao buscar ofertas no Supabase (mantendo padrão):', error);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          renderOffersToGrid(data);
        } else {
          renderOffersToGrid(window.BELA_DEFAULT_OFFERS);
        }
      };

      await fetchOffers();

      // Escuta mudanças em tempo real caso o Realtime esteja habilitado na tabela
      sb.client
        .channel('ofertas-vitrine')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas' }, () => {
          fetchOffers();
        })
        .subscribe();
      return;
    }

    try {
      const localRaw = localStorage.getItem(window.BELA_LOCAL_DEMO_KEY);
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (Array.isArray(parsed)) {
          renderOffersToGrid(parsed);
        }
      }
    } catch (_) {
      // Mantém as 8 ofertas estáticas padrão do HTML
    }
  }

  syncOffersFromStore();
});
