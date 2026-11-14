// ============================================================================
// CONFIGURAÇÃO DO SUPABASE & CATÁLOGO DE CATEGORIAS - BELA ALIANÇA
// ============================================================================
// Como funciona:
// 1. Se o site estiver publicado na Vercel com a integração "Supabase" conectada,
//    ele tenta ler automaticamente a URL e a Chave Pública via /api/supabase-config.
// 2. Você também pode colar aqui embaixo sua URL e Anon Key do Supabase para
//    conectar direto inclusive em testes locais (file:/// ou localhost).
// ============================================================================

window.BELA_SUPABASE_CONFIG = {
  url: "https://ckeozluuespolmhvzyus.supabase.co",
  anonKey: "sb_publishable_t3Wk4uoJBTF6NDaYXbX36w_CfKmo7x6"
};

window.BELA_WHATSAPP_NUMBER = "5561999945097";
window.BELA_LOCAL_DEMO_KEY = "bela_alianca_ofertas_demo_v1";

// Categorias oficiais das Ofertas da Semana
window.BELA_CATEGORIES = {
  eletrica: {
    id: "eletrica",
    label: "Elétrica",
    tabLabel: "⚡ Elétrica",
    emoji: "⚡",
    defaultSubcat: "Materiais Elétricos"
  },
  hidraulica: {
    id: "hidraulica",
    label: "Hidráulica",
    tabLabel: "💧 Hidráulica",
    emoji: "💧",
    defaultSubcat: "Linha Hidráulica"
  },
  pintura: {
    id: "pintura",
    label: "Pintura & Tintas",
    tabLabel: "🎨 Pintura & Tintas",
    emoji: "🎨",
    defaultSubcat: "Tintas & Impermeabilizantes"
  },
  ferramentas: {
    id: "ferramentas",
    label: "Ferramentas",
    tabLabel: "🛠️ Ferramentas",
    emoji: "🛠️",
    defaultSubcat: "Ferramentas & EPIs"
  },
  iluminacao: {
    id: "iluminacao",
    label: "Iluminação LED",
    tabLabel: "💡 Iluminação",
    emoji: "💡",
    defaultSubcat: "Iluminação LED"
  },
  utilidades: {
    id: "utilidades",
    label: "Utilidades & Casa",
    tabLabel: "🏠 Utilidades",
    emoji: "🏠",
    defaultSubcat: "Utilidades & Casa"
  }
};

// Galeria de imagens já presentes no projeto (para seleção rápida no painel)
window.BELA_IMAGE_PRESETS = [
  { label: "Tinta Emborrachada", path: "assets/img/post-tinta-emborrachada.jpg" },
  { label: "Padrão de Energia", path: "assets/img/post-padrao-energia.jpg" },
  { label: "Cabos Elétricos", path: "assets/img/carousel/02-cabos-eletricos.jpg" },
  { label: "Disjuntores e Quadros", path: "assets/img/carousel/01-disjuntores-quadro.jpg" },
  { label: "Iluminação LED", path: "assets/img/carousel/03-iluminacao-led.jpg" },
  { label: "Refletores LED", path: "assets/img/carousel/19-refletores-luminarias-externas.jpg" },
  { label: "Parafusadeira", path: "assets/img/carousel/08-parafusadeira-furadeira.jpg" },
  { label: "Maleta Ferramentas", path: "assets/img/carousel/14-maleta-ferramentas-manuais.jpg" },
  { label: "Chuveiro / Ducha", path: "assets/img/carousel/09-chuveiro-ducha-banheiro.jpg" },
  { label: "Cuba Inox", path: "assets/img/carousel/10-cuba-pia-inox.jpg" },
  { label: "Torneira Gourmet", path: "assets/img/carousel/06-torneira-misturador-inox.jpg" },
  { label: "Tubos & Conexões", path: "assets/img/carousel/05-tubos-conexoes-pvc.jpg" },
  { label: "Ralos Protetores", path: "assets/img/post-ralo-protecao.jpg" },
  { label: "Tintas & Rolos", path: "assets/img/carousel/15-tintas-rolo-impermeabilizante.jpg" },
  { label: "Churrasqueira", path: "assets/img/post-churrasqueira.jpg" },
  { label: "EPIs & Obra", path: "assets/img/carousel/20-equipamentos-protecao-epi.jpg" }
];

// As 8 ofertas iniciais da loja (usadas como base e para importação 1-clique no painel)
window.BELA_DEFAULT_OFFERS = [
  {
    id: "default-1",
    titulo: "Tinta Emborrachada Delcor Impermeabilizante",
    categoria: "pintura",
    subcategoria: "Tintas & Impermeabilizantes",
    precoAntigo: 450.0,
    precoNovo: 299.9,
    observacao: "À vista no PIX, Dinheiro ou Débito",
    selo: "-33% OFF",
    seloDestaque: false,
    imagem: "assets/img/post-tinta-emborrachada.jpg",
    ativo: true,
    destaque: false,
    ordem: 1
  },
  {
    id: "default-2",
    titulo: "Padrão Monofásico Equatorial 5MT Completo",
    categoria: "eletrica",
    subcategoria: "Padrão de Energia",
    precoAntigo: 689.9,
    precoNovo: 589.9,
    observacao: "À vista ou consulte parcelamento",
    selo: "SUPER OFERTA",
    seloDestaque: true,
    imagem: "assets/img/post-padrao-energia.jpg",
    ativo: true,
    destaque: true,
    ordem: 2
  },
  {
    id: "default-3",
    titulo: "Cabo Flexível 2,5mm Rolo c/ 100m Certificado",
    categoria: "eletrica",
    subcategoria: "Condutores Elétricos",
    precoAntigo: 219.9,
    precoNovo: 169.9,
    observacao: "À vista no PIX ou Dinheiro",
    selo: "-22% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/02-cabos-eletricos.jpg",
    ativo: true,
    destaque: false,
    ordem: 3
  },
  {
    id: "default-4",
    titulo: "Parafusadeira / Furadeira sem Fio c/ Maleta",
    categoria: "ferramentas",
    subcategoria: "Ferramentas Elétricas",
    precoAntigo: 289.0,
    precoNovo: 199.9,
    observacao: "À vista ou em até 3x sem juros",
    selo: "-30% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/08-parafusadeira-furadeira.jpg",
    ativo: true,
    destaque: false,
    ordem: 4
  },
  {
    id: "default-5",
    titulo: "Ducha / Chuveiro Eletrônico Multitemperaturas",
    categoria: "hidraulica",
    subcategoria: "Banheiro & Hidráulica",
    precoAntigo: 159.9,
    precoNovo: 114.9,
    observacao: "À vista no PIX ou Dinheiro",
    selo: "-28% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/09-chuveiro-ducha-banheiro.jpg",
    ativo: true,
    destaque: false,
    ordem: 5
  },
  {
    id: "default-6",
    titulo: "Cuba de Aço Inox Funda c/ Válvula",
    categoria: "hidraulica",
    subcategoria: "Inox & Cozinha",
    precoAntigo: 349.0,
    precoNovo: 249.9,
    observacao: "À vista ou em até 3x no cartão",
    selo: "-28% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/10-cuba-pia-inox.jpg",
    ativo: true,
    destaque: false,
    ordem: 6
  },
  {
    id: "default-7",
    titulo: "Kit c/ 5 Painéis Plafon LED 18W Branco Frio",
    categoria: "iluminacao",
    subcategoria: "Iluminação LED",
    precoAntigo: 125.0,
    precoNovo: 89.9,
    observacao: "Sai a R$ 17,98 cada no kit",
    selo: "-28% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/03-iluminacao-led.jpg",
    ativo: true,
    destaque: false,
    ordem: 7
  },
  {
    id: "default-8",
    titulo: "Torneira Gourmet Flexível 2 Jatos Metal Cromado",
    categoria: "hidraulica",
    subcategoria: "Metais & Acabamentos",
    precoAntigo: 189.9,
    precoNovo: 129.9,
    observacao: "À vista no PIX ou Dinheiro",
    selo: "-31% OFF",
    seloDestaque: false,
    imagem: "assets/img/carousel/06-torneira-misturador-inox.jpg",
    ativo: true,
    destaque: false,
    ordem: 8
  }
];

// ============================================================================
// UTILITÁRIOS COMPARTILHADOS
// ============================================================================
window.BelaUtils = {
  normalizeCategory(cat) {
    const raw = String(cat || "eletrica")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (raw === "tintas" || raw === "tinta" || raw === "pintura") return "pintura";
    if (raw === "eletrica" || raw === "elétrica") return "eletrica";
    if (raw === "hidraulica") return "hidraulica";
    if (raw === "ferramentas" || raw === "ferramenta") return "ferramentas";
    if (raw === "iluminacao" || raw === "led") return "iluminacao";
    if (raw === "utilidades" || raw === "lazer" || raw === "casa") return "utilidades";
    return window.BELA_CATEGORIES[raw] ? raw : "eletrica";
  },

  getCategoryMeta(cat) {
    const key = this.normalizeCategory(cat);
    return window.BELA_CATEGORIES[key] || window.BELA_CATEGORIES.eletrica;
  },

  parsePrice(val) {
    if (typeof val === "number") return Number.isFinite(val) ? val : 0;
    const str = String(val || "").replace(/[^\d.,]/g, "").trim();
    if (!str) return 0;

    if (str.includes(",") && str.includes(".")) {
      const normalized = str.replace(/\./g, "").replace(",", ".");
      const n = parseFloat(normalized);
      return Number.isFinite(n) ? n : 0;
    }

    if (str.includes(",")) {
      const n = parseFloat(str.replace(",", "."));
      return Number.isFinite(n) ? n : 0;
    }

    const n = parseFloat(str);
    return Number.isFinite(n) ? n : 0;
  },

  formatPriceBR(num) {
    const n = this.parsePrice(num);
    return n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  calcBadge(precoAntigo, precoNovo, seloPersonalizado) {
    const custom = String(seloPersonalizado || "").trim();
    if (custom) return custom;

    const oldP = this.parsePrice(precoAntigo);
    const newP = this.parsePrice(precoNovo);
    if (oldP > 0 && newP > 0 && oldP > newP) {
      const pct = Math.round(((oldP - newP) / oldP) * 100);
      if (pct >= 1) return `-${pct}% OFF`;
    }
    return "OFERTA";
  },

  isHotBadge(badgeText, seloDestaque) {
    if (seloDestaque) return true;
    const upper = String(badgeText || "").toUpperCase();
    return (
      upper.includes("SUPER") ||
      upper.includes("DESTAQUE") ||
      upper.includes("QUEIMA") ||
      upper.includes("RELÂMPAGO") ||
      upper.includes("NOVIDADE")
    );
  },

  escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  sanitizeImageUrl(url) {
    const clean = String(url || "").trim();
    if (!clean) return "";
    if (
      /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(clean) ||
      clean.startsWith("https://") ||
      clean.startsWith("http://") ||
      clean.startsWith("assets/") ||
      clean.startsWith("./assets/")
    ) {
      return clean;
    }
    return "";
  },

  buildOfferMediaHTML(url, altText) {
    const cleanUrl = this.sanitizeImageUrl(url);
    const renderPlaceholder = (hidden) => `
      <div class="offer-img-placeholder"${hidden ? ' style="display:none;"' : ""} aria-label="Local para adicionar imagem do produto">
        <svg class="offer-camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </div>
    `;

    if (!cleanUrl) return renderPlaceholder(false);

    const safeAlt = this.escapeHTML(altText || "Produto em oferta");
    const safeSrc = this.escapeHTML(cleanUrl);
    return `
      <img src="${safeSrc}" alt="${safeAlt}" loading="lazy"
        onerror="this.style.display='none'; if(this.nextElementSibling){this.nextElementSibling.style.display='flex';}" />
      ${renderPlaceholder(true)}
    `;
  },

  buildWhatsAppLink(titulo, precoNovo) {
    const preco = this.formatPriceBR(precoNovo);
    const msg = `Olá! Quero aproveitar a Oferta da Semana: ${titulo} por R$ ${preco}!`;
    return `https://wa.me/${window.BELA_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  },

  // Converte linha vinda do Supabase (snake_case) ou objeto local (camelCase) para formato padrão
  normalizeOfferRow(row) {
    const r = row || {};
    const createdRaw = r.created_at || r.createdAt;
    const createdAtMs =
      typeof r.createdAtMs === "number"
        ? r.createdAtMs
        : createdRaw
        ? Date.parse(createdRaw) || 0
        : 0;

    return {
      id: r.id,
      titulo: r.titulo || "",
      categoria: this.normalizeCategory(r.categoria),
      subcategoria: r.subcategoria || "",
      precoAntigo: this.parsePrice(r.precoAntigo ?? r.preco_antigo ?? 0),
      precoNovo: this.parsePrice(r.precoNovo ?? r.preco_novo ?? 0),
      observacao: r.observacao || "À vista no PIX ou Dinheiro",
      selo: r.selo || "",
      seloDestaque: Boolean(r.seloDestaque ?? r.selo_destaque ?? false),
      imagem: this.sanitizeImageUrl(r.imagem || ""),
      ativo: r.ativo !== false,
      destaque: Boolean(r.destaque),
      ordem: Number(r.ordem || 999),
      createdAtMs
    };
  },

  // Converte objeto padrão JS para linha da tabela public.ofertas no Supabase
  toDbOfferRow(offer) {
    return {
      titulo: offer.titulo,
      categoria: this.normalizeCategory(offer.categoria),
      subcategoria: offer.subcategoria || "",
      preco_antigo: this.parsePrice(offer.precoAntigo),
      preco_novo: this.parsePrice(offer.precoNovo),
      observacao: offer.observacao || "À vista no PIX ou Dinheiro",
      selo: offer.selo || "",
      selo_destaque: Boolean(offer.seloDestaque),
      imagem: this.sanitizeImageUrl(offer.imagem),
      ativo: offer.ativo !== false,
      destaque: Boolean(offer.destaque),
      ordem: Number(offer.ordem || 999),
      updated_at: new Date().toISOString()
    };
  },

  buildOfferCardHTML(offer, isInteractive = true) {
    const normalized = this.normalizeOfferRow(offer);
    const catMeta = this.getCategoryMeta(normalized.categoria);
    const catKey = catMeta.id;
    const subcat = this.escapeHTML(normalized.subcategoria || catMeta.defaultSubcat);
    const titulo = this.escapeHTML(normalized.titulo || "Produto em Oferta");
    const precoAntigo = normalized.precoAntigo;
    const precoNovo = normalized.precoNovo;
    const obs = this.escapeHTML(normalized.observacao || "À vista no PIX ou Dinheiro");
    const badgeText = this.calcBadge(precoAntigo, precoNovo, normalized.selo);
    const isHot = this.isHotBadge(badgeText, normalized.seloDestaque);
    const mediaHTML = this.buildOfferMediaHTML(normalized.imagem, normalized.titulo || "Produto em Oferta");
    const waHref = this.buildWhatsAppLink(normalized.titulo || "Produto em Oferta", precoNovo);

    const oldPriceHTML =
      precoAntigo > 0 && precoAntigo > precoNovo
        ? `<span class="price-old">De R$ ${this.formatPriceBR(precoAntigo)}</span>`
        : `<span class="price-old" style="visibility:hidden">Oferta Especial</span>`;

    return `
      <article class="offer-card" data-category="${catKey}" ${isInteractive ? 'tabindex="0"' : ""}>
        <div class="offer-img-wrap">
          <span class="offer-discount-badge ${isHot ? "badge-hot" : ""}">${this.escapeHTML(badgeText)}</span>
          ${mediaHTML}
        </div>
        <div class="offer-body">
          <span class="offer-cat">${subcat}</span>
          <h3>${titulo}</h3>
          <div class="offer-price-box">
            ${oldPriceHTML}
            <div class="price-current">
              <small>Por R$</small> <strong>${this.formatPriceBR(precoNovo)}</strong>
            </div>
            <span class="price-note">${obs}</span>
          </div>
          <div class="offer-wa-drawer">
            <a href="${waHref}" target="_blank" rel="noopener" class="btn-offer-wa">
              <svg viewBox="0 0 32 32" fill="currentColor">
                <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.59 4.46 1.71 6.404L3.2 28.8l6.56-1.72c1.88 1.025 3.998 1.566 6.244 1.566 7.07 0 12.8-5.73 12.8-12.8 0-3.42-1.332-6.635-3.75-9.054C22.636 4.532 19.42 3.2 16.004 3.2zm0 23.29c-1.99 0-3.94-.535-5.646-1.547l-.405-.24-4.205 1.103 1.122-4.1-.264-.42c-1.098-1.747-1.678-3.766-1.678-5.846 0-6.055 4.925-10.98 10.98-10.98 2.933 0 5.69 1.143 7.763 3.217 2.073 2.074 3.215 4.83 3.215 7.763 0 6.055-4.925 10.98-10.882 11.05zm6.022-8.21c-.33-.165-1.953-.964-2.255-1.074-.303-.11-.523-.165-.743.165-.22.33-.853 1.074-1.046 1.294-.192.22-.385.248-.715.083-.33-.165-1.394-.514-2.655-1.638-.98-.875-1.643-1.956-1.836-2.286-.193-.33-.02-.508.145-.673.149-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.082-.165-.743-1.79-1.018-2.45-.268-.642-.54-.555-.743-.565-.192-.01-.413-.012-.633-.012-.22 0-.578.082-.88.413-.303.33-1.156 1.13-1.156 2.753 0 1.624 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.64 4.985.788.34 1.403.543 1.883.695.79.25 1.51.215 2.078.13.634-.095 1.953-.798 2.228-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
              </svg>
              <span>Eu Quero no WhatsApp</span>
            </a>
          </div>
        </div>
      </article>
    `;
  },

  isStaticConfigValid(cfg) {
    if (!cfg || !cfg.url || !cfg.anonKey) return false;
    if (cfg.url.includes("COLE_") || cfg.anonKey.includes("COLE_")) return false;
    return cfg.url.startsWith("https://");
  },

  async resolveSupabaseConfig() {
    const localCfg = window.BELA_SUPABASE_CONFIG;
    if (this.isStaticConfigValid(localCfg)) {
      return localCfg;
    }

    // Se estiver hospedado na Vercel (http/https), tenta ler automaticamente /api/supabase-config
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      try {
        const res = await fetch("/api/supabase-config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.configured && this.isStaticConfigValid(data)) {
            return { url: data.url, anonKey: data.anonKey };
          }
        }
      } catch (_) {
        // Sem endpoint Vercel ativo (ex: servidor estático simples) -> usa Modo Local
      }
    }

    return null;
  },

  async initSupabase() {
    const cfg = await this.resolveSupabaseConfig();
    if (!cfg || typeof window.supabase === "undefined" || typeof window.supabase.createClient !== "function") {
      return { configured: false, client: null };
    }

    try {
      const client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          detectSessionInUrl: false
        }
      });
      return { configured: true, client };
    } catch (err) {
      console.error("Erro ao inicializar Supabase:", err);
      return { configured: false, client: null, error: err };
    }
  }
};

