// ============================================================================
// BELA ALIANÇA ELÉTRICA E HIDRÁULICA — PAINEL DO LOJISTA (OFERTAS + FIREBASE)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const Utils = window.BelaUtils;

  // Elementos principais
  const themeToggle = document.getElementById("theme-toggle");
  const statusPill = document.getElementById("firebase-status-pill");
  const statusText = document.getElementById("firebase-status-text");
  const btnLogout = document.getElementById("btn-logout");

  const loginSection = document.getElementById("admin-login-section");
  const loginForm = document.getElementById("login-form");
  const loginEmailInput = document.getElementById("login-email");
  const loginPassInput = document.getElementById("login-password");
  const loginErrorBox = document.getElementById("login-error-box");

  const dashboardSection = document.getElementById("admin-dashboard");

  // Formulário de Oferta
  const offerForm = document.getElementById("offer-form");
  const formTitleEl = document.getElementById("form-section-title");
  const offerIdInput = document.getElementById("offer-id");
  const offerCatInput = document.getElementById("offer-categoria");
  const catButtons = document.querySelectorAll(".cat-choice-btn");
  const offerTituloInput = document.getElementById("offer-titulo");
  const offerSubcatInput = document.getElementById("offer-subcat");
  const offerPrecoAntigoInput = document.getElementById("offer-preco-antigo");
  const offerPrecoNovoInput = document.getElementById("offer-preco-novo");
  const offerSeloInput = document.getElementById("offer-selo");
  const offerObsInput = document.getElementById("offer-obs");
  const offerImgFinalInput = document.getElementById("offer-imagem-final");
  const offerImgFileInput = document.getElementById("offer-img-file");
  const offerImgUrlInput = document.getElementById("offer-img-url");
  const uploadStatusHint = document.getElementById("upload-status-hint");
  const offerAtivoCheckbox = document.getElementById("offer-ativo");
  const offerDestaqueCheckbox = document.getElementById("offer-destaque");
  const btnSaveOffer = document.getElementById("btn-save-offer");
  const btnCancelEdit = document.getElementById("btn-cancel-edit");

  // Imagem Tabs e Galeria
  const imgTabButtons = document.querySelectorAll(".img-tab-btn");
  const imgPanelUpload = document.getElementById("img-panel-upload");
  const imgPanelPreset = document.getElementById("img-panel-preset");
  const imgPanelUrl = document.getElementById("img-panel-url");
  const presetGalleryGrid = document.getElementById("preset-gallery-grid");

  // Preview e Lista
  const previewStage = document.getElementById("preview-card-stage");
  const togglePreviewHover = document.getElementById("toggle-preview-hover");
  const offersListEl = document.getElementById("admin-offers-list");
  const btnImportDefaults = document.getElementById("btn-import-defaults");
  const searchInput = document.getElementById("admin-search-input");
  const filterCatSelect = document.getElementById("admin-filter-cat");
  const filterStatusSelect = document.getElementById("admin-filter-status");

  // KPIs
  const kpiTotal = document.getElementById("kpi-total");
  const kpiAtivas = document.getElementById("kpi-ativas");
  const kpiPausadas = document.getElementById("kpi-pausadas");
  const kpiCategorias = document.getElementById("kpi-categorias");

  // Modal e Toast
  const deleteModal = document.getElementById("delete-modal");
  const deleteModalDesc = document.getElementById("delete-modal-desc");
  const btnCancelDelete = document.getElementById("btn-cancel-delete");
  const btnConfirmDelete = document.getElementById("btn-confirm-delete");
  const toastEl = document.getElementById("admin-toast");

  // Estado
  let sbState = { configured: false, client: null };
  let allOffers = [];
  let pendingDeleteId = null;
  let toastTimer = null;

  // ==========================================================================
  // TEMA CLARO / ESCURO COMPARTILHADO COM O SITE PRINCIPAL
  // ==========================================================================
  if (localStorage.getItem("bela_theme") === "dark") {
    document.body.classList.add("dark-theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("bela_theme", isDark ? "dark" : "light");
    });
  }

  // ==========================================================================
  // NOTIFICAÇÕES TOAST
  // ==========================================================================
  function showToast(msg, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-error", isError);
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3600);
  }

  // ==========================================================================
  // ARMAZENAMENTO: SUPABASE POSTGRES vs MODO LOCAL
  // ==========================================================================
  function getLocalDemoOffers() {
    try {
      const raw = localStorage.getItem(window.BELA_LOCAL_DEMO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((o) => Utils.normalizeOfferRow(o));
      }
    } catch (_) {
      // Fallback abaixo
    }
    const seed = window.BELA_DEFAULT_OFFERS.map((o) => ({ ...o, createdAtMs: Date.now() }));
    localStorage.setItem(window.BELA_LOCAL_DEMO_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveLocalDemoOffers(list) {
    localStorage.setItem(window.BELA_LOCAL_DEMO_KEY, JSON.stringify(list));
    allOffers = list.map((o) => Utils.normalizeOfferRow(o));
    refreshOffersUI();
  }

  async function loadSupabaseOffers() {
    if (!sbState.configured || !sbState.client) return;
    const { data, error } = await sbState.client.from("ofertas").select("*");
    if (error) {
      if (error.code === "42P01" || String(error.message || "").includes("does not exist")) {
        showToast("Tabela 'ofertas' ainda não criada no Supabase. Rode o supabase_setup.sql no SQL Editor.", true);
      } else {
        showToast("Erro ao carregar ofertas do Supabase: " + error.message, true);
      }
      return;
    }
    allOffers = (data || []).map((row) => Utils.normalizeOfferRow(row));
    refreshOffersUI();
  }

  async function saveOfferRecord(data, editId) {
    if (sbState.configured && sbState.client) {
      const existingOffer = editId
        ? allOffers.find((item) => String(item.id) === String(editId))
        : null;
      const dbRow = Utils.toDbOfferRow({
        ...data,
        ordem: editId
          ? data.ordem || (existingOffer && existingOffer.ordem) || 999
          : allOffers.length + 1
      });

      if (editId) {
        const { error } = await sbState.client.from("ofertas").update(dbRow).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await sbState.client.from("ofertas").insert([dbRow]);
        if (error) throw error;
      }
      await loadSupabaseOffers();
      return;
    }

    // Modo Local
    const list = [...allOffers];
    if (editId) {
      const idx = list.findIndex((item) => String(item.id) === String(editId));
      if (idx !== -1) {
        list[idx] = Utils.normalizeOfferRow({ ...list[idx], ...data, id: editId });
      }
    } else {
      list.unshift(
        Utils.normalizeOfferRow({
          ...data,
          id: "local-" + Date.now(),
          ordem: list.length + 1,
          createdAtMs: Date.now()
        })
      );
    }
    saveLocalDemoOffers(list);
  }

  async function toggleOfferActive(id) {
    const target = allOffers.find((o) => String(o.id) === String(id));
    if (!target) return;
    const nextState = target.ativo === false;

    if (sbState.configured && sbState.client) {
      try {
        const { error } = await sbState.client
          .from("ofertas")
          .update({ ativo: nextState, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) throw error;
        await loadSupabaseOffers();
        showToast(nextState ? "Promoção ativada no site!" : "Promoção pausada no site.");
      } catch (err) {
        showToast("Erro ao atualizar status no Supabase: " + err.message, true);
      }
      return;
    }

    const updated = allOffers.map((item) =>
      String(item.id) === String(id) ? { ...item, ativo: nextState } : item
    );
    saveLocalDemoOffers(updated);
    showToast(nextState ? "Promoção ativada!" : "Promoção pausada.");
  }

  async function deleteOfferRecord(id) {
    if (sbState.configured && sbState.client) {
      const { error } = await sbState.client.from("ofertas").delete().eq("id", id);
      if (error) throw error;
      await loadSupabaseOffers();
      return;
    }

    const updated = allOffers.filter((item) => String(item.id) !== String(id));
    saveLocalDemoOffers(updated);
  }

  async function importDefaultOffers() {
    if (sbState.configured && sbState.client) {
      try {
        btnImportDefaults.disabled = true;
        btnImportDefaults.textContent = "Importando...";
        const existingTitles = new Set(allOffers.map((o) => String(o.titulo || "").toLowerCase()));
        const rowsToInsert = window.BELA_DEFAULT_OFFERS.filter(
          (offer) => !existingTitles.has(offer.titulo.toLowerCase())
        ).map((offer) => Utils.toDbOfferRow(offer));

        if (rowsToInsert.length > 0) {
          const { error } = await sbState.client.from("ofertas").insert(rowsToInsert);
          if (error) throw error;
          await loadSupabaseOffers();
          showToast(`${rowsToInsert.length} ofertas modelo importadas para o Supabase!`);
        } else {
          showToast("As ofertas modelo já estão cadastradas no Supabase.");
        }
      } catch (err) {
        showToast("Erro ao importar para o Supabase: " + err.message, true);
      } finally {
        btnImportDefaults.disabled = false;
        btnImportDefaults.textContent = "📥 Importar 8 Ofertas Modelo";
      }
      return;
    }

    const existingTitles = new Set(allOffers.map((o) => String(o.titulo || "").toLowerCase()));
    const toAdd = window.BELA_DEFAULT_OFFERS.filter(
      (o) => !existingTitles.has(o.titulo.toLowerCase())
    ).map((o, idx) => ({
      ...o,
      id: "local-seed-" + Date.now() + "-" + idx,
      createdAtMs: Date.now()
    }));

    if (toAdd.length === 0) {
      showToast("As 8 ofertas modelo já estão na lista.");
      return;
    }
    saveLocalDemoOffers([...allOffers, ...toAdd]);
    showToast(`${toAdd.length} ofertas modelo adicionadas!`);
  }

  // ==========================================================================
  // FORMULÁRIO: CATEGORIAS, IMAGENS, COMPRESSÃO E PREVIEW AO VIVO
  // ==========================================================================
  function getFormDraftOffer() {
    const catMeta = Utils.getCategoryMeta(offerCatInput.value);
    return {
      titulo: offerTituloInput.value.trim() || "Nome do Produto em Promoção",
      categoria: catMeta.id,
      subcategoria: offerSubcatInput.value.trim() || catMeta.defaultSubcat,
      precoAntigo: Utils.parsePrice(offerPrecoAntigoInput.value),
      precoNovo: Utils.parsePrice(offerPrecoNovoInput.value) || 0,
      selo: offerSeloInput.value.trim(),
      seloDestaque: Utils.isHotBadge(offerSeloInput.value.trim(), offerDestaqueCheckbox.checked),
      observacao: offerObsInput.value.trim() || "À vista no PIX ou Dinheiro",
      imagem: offerImgFinalInput.value.trim(),
      ativo: offerAtivoCheckbox.checked,
      destaque: offerDestaqueCheckbox.checked
    };
  }

  function updateLivePreview() {
    if (!previewStage) return;
    const draft = getFormDraftOffer();
    previewStage.innerHTML = Utils.buildOfferCardHTML(draft, false);

    const card = previewStage.querySelector(".offer-card");
    if (card && togglePreviewHover && togglePreviewHover.checked) {
      card.classList.add("force-hover");
    }
  }

  // Seleção de Categoria via Botões
  function setSelectedCategory(catKey, autoFillSubcat = true) {
    const normalized = Utils.normalizeCategory(catKey);
    offerCatInput.value = normalized;
    catButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-cat") === normalized);
    });

    if (autoFillSubcat) {
      const currentSub = offerSubcatInput.value.trim();
      const isDefaultOther = Object.values(window.BELA_CATEGORIES).some(
        (c) => c.defaultSubcat === currentSub
      );
      if (!currentSub || isDefaultOther) {
        offerSubcatInput.value = Utils.getCategoryMeta(normalized).defaultSubcat;
      }
    }
    updateLivePreview();
  }

  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setSelectedCategory(btn.getAttribute("data-cat"), true);
    });
  });

  // Chips rápidos de Selo e Condição de Pagamento
  document.querySelectorAll("[data-fill-selo]").forEach((chip) => {
    chip.addEventListener("click", () => {
      offerSeloInput.value = chip.getAttribute("data-fill-selo") || "";
      updateLivePreview();
    });
  });

  document.querySelectorAll("[data-fill-obs]").forEach((chip) => {
    chip.addEventListener("click", () => {
      offerObsInput.value = chip.getAttribute("data-fill-obs") || "";
      updateLivePreview();
    });
  });

  // Troca de abas de Imagem
  imgTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-img-mode");
      imgTabButtons.forEach((b) => b.classList.toggle("active", b === btn));
      imgPanelUpload.classList.toggle("hidden", mode !== "upload");
      imgPanelPreset.classList.toggle("hidden", mode !== "preset");
      imgPanelUrl.classList.toggle("hidden", mode !== "url");
    });
  });

  // Renderizar galeria de fotos da loja
  function renderPresetGallery() {
    if (!presetGalleryGrid) return;
    const currentImg = offerImgFinalInput.value;
    presetGalleryGrid.innerHTML = window.BELA_IMAGE_PRESETS.map(
      (item) => `
      <button type="button" class="preset-thumb-btn ${currentImg === item.path ? "active" : ""}" data-preset-path="${Utils.escapeHTML(item.path)}">
        <img src="${Utils.escapeHTML(item.path)}" alt="${Utils.escapeHTML(item.label)}" loading="lazy" />
        <span>${Utils.escapeHTML(item.label)}</span>
      </button>
    `
    ).join("");
  }

  if (presetGalleryGrid) {
    presetGalleryGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".preset-thumb-btn");
      if (!btn) return;
      const path = btn.getAttribute("data-preset-path");
      offerImgFinalInput.value = path;
      renderPresetGallery();
      updateLivePreview();
    });
  }

  // Compressão automática da imagem enviada pelo celular/PC (para salvar grátis no Firestore)
  function compressImageToDataURL(file, maxSize = 680, maxBytes = 140000) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo de imagem."));
      reader.onload = (ev) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Formato de imagem inválido."));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width >= height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > maxBytes && quality > 0.35) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(dataUrl);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (offerImgFileInput) {
    offerImgFileInput.addEventListener("change", async () => {
      const file = offerImgFileInput.files && offerImgFileInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Selecione um arquivo de imagem (JPG, PNG ou WebP).", true);
        return;
      }
      try {
        uploadStatusHint.textContent = "Otimizando foto automaticamente...";
        const compressed = await compressImageToDataURL(file);
        offerImgFinalInput.value = compressed;
        const approxKB = Math.round((compressed.length * 0.75) / 1024);
        uploadStatusHint.textContent = `Foto pronta (${approxKB} KB) — otimizada para carregar rápido no site!`;
        updateLivePreview();
      } catch (err) {
        uploadStatusHint.textContent = "Erro ao processar foto. Tente outra imagem.";
        showToast(err.message, true);
      }
    });
  }

  if (offerImgUrlInput) {
    offerImgUrlInput.addEventListener("input", () => {
      offerImgFinalInput.value = offerImgUrlInput.value.trim();
      updateLivePreview();
    });
  }

  // Atualiza preview enquanto o usuário digita
  [
    offerTituloInput,
    offerSubcatInput,
    offerPrecoAntigoInput,
    offerPrecoNovoInput,
    offerSeloInput,
    offerObsInput,
    offerAtivoCheckbox,
    offerDestaqueCheckbox
  ].forEach((el) => {
    if (el) {
      el.addEventListener("input", updateLivePreview);
      el.addEventListener("change", updateLivePreview);
    }
  });

  if (togglePreviewHover) {
    togglePreviewHover.addEventListener("change", updateLivePreview);
  }

  // Resetar Formulário
  function resetOfferForm() {
    offerForm.reset();
    offerIdInput.value = "";
    setSelectedCategory("eletrica", false);
    offerSubcatInput.value = Utils.getCategoryMeta("eletrica").defaultSubcat;
    offerImgFinalInput.value = "";
    offerImgUrlInput.value = "";
    uploadStatusHint.textContent =
      "Compressão automática leve para carregar rápido no site e no banco Supabase";
    offerAtivoCheckbox.checked = true;
    offerDestaqueCheckbox.checked = false;
    formTitleEl.textContent = "➕ Adicionar Promoção da Semana";
    btnSaveOffer.textContent = "💾 Salvar Promoção no Site";
    btnCancelEdit.classList.add("hidden");
    renderPresetGallery();
    updateLivePreview();
  }

  function loadOfferIntoForm(offer) {
    offerIdInput.value = offer.id;
    setSelectedCategory(offer.categoria, false);
    offerTituloInput.value = offer.titulo || "";
    offerSubcatInput.value = offer.subcategoria || "";
    offerPrecoAntigoInput.value =
      offer.precoAntigo > 0 ? Utils.formatPriceBR(offer.precoAntigo) : "";
    offerPrecoNovoInput.value =
      offer.precoNovo > 0 ? Utils.formatPriceBR(offer.precoNovo) : "";
    offerSeloInput.value = offer.selo || "";
    offerObsInput.value = offer.observacao || "";
    offerImgFinalInput.value = offer.imagem || "";
    offerImgUrlInput.value = String(offer.imagem || "").startsWith("http") ? offer.imagem : "";
    offerAtivoCheckbox.checked = offer.ativo !== false;
    offerDestaqueCheckbox.checked = Boolean(offer.destaque);

    formTitleEl.textContent = "✏️ Editar Promoção";
    btnSaveOffer.textContent = "🔄 Atualizar Promoção no Site";
    btnCancelEdit.classList.remove("hidden");
    renderPresetGallery();
    updateLivePreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", resetOfferForm);
  }

  // Submeter Formulário
  if (offerForm) {
    offerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const titulo = offerTituloInput.value.trim();
      const precoNovo = Utils.parsePrice(offerPrecoNovoInput.value);
      const precoAntigo = Utils.parsePrice(offerPrecoAntigoInput.value);

      if (!titulo) {
        showToast("Informe o nome do produto ou promoção.", true);
        offerTituloInput.focus();
        return;
      }

      if (!(precoNovo > 0)) {
        showToast("Informe um preço promocional válido maior que zero.", true);
        offerPrecoNovoInput.focus();
        return;
      }

      const catMeta = Utils.getCategoryMeta(offerCatInput.value);
      const seloTexto = offerSeloInput.value.trim();

      const payload = {
        titulo,
        categoria: catMeta.id,
        subcategoria: offerSubcatInput.value.trim() || catMeta.defaultSubcat,
        precoAntigo: precoAntigo > precoNovo ? precoAntigo : 0,
        precoNovo,
        selo: seloTexto,
        seloDestaque: Utils.isHotBadge(seloTexto, offerDestaqueCheckbox.checked),
        observacao: offerObsInput.value.trim() || "À vista no PIX ou Dinheiro",
        imagem: Utils.sanitizeImageUrl(offerImgFinalInput.value),
        ativo: offerAtivoCheckbox.checked,
        destaque: offerDestaqueCheckbox.checked
      };

      const editId = offerIdInput.value.trim();

      try {
        btnSaveOffer.disabled = true;
        btnSaveOffer.textContent = "Salvando...";
        await saveOfferRecord(payload, editId || null);
        showToast(editId ? "Promoção atualizada no site!" : "Nova promoção publicada no site!");
        resetOfferForm();
      } catch (err) {
        console.error(err);
        showToast("Erro ao salvar promoção: " + (err.message || err), true);
      } finally {
        btnSaveOffer.disabled = false;
        btnSaveOffer.textContent = offerIdInput.value
          ? "🔄 Atualizar Promoção no Site"
          : "💾 Salvar Promoção no Site";
      }
    });
  }

  // ==========================================================================
  // LISTA DE PROMOÇÕES, FILTROS & MODAL DE EXCLUSÃO
  // ==========================================================================
  function refreshOffersUI() {
    const sorted = [...allOffers].sort((a, b) => {
      const destA = a.destaque ? 1 : 0;
      const destB = b.destaque ? 1 : 0;
      if (destA !== destB) return destB - destA;
      const ordA = Number(a.ordem || 999);
      const ordB = Number(b.ordem || 999);
      if (ordA !== ordB) return ordA - ordB;
      return Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0);
    });

    // Atualizar KPIs
    const activeCount = sorted.filter((o) => o.ativo !== false).length;
    const pausedCount = sorted.length - activeCount;
    const catSet = new Set(
      sorted.filter((o) => o.ativo !== false).map((o) => Utils.normalizeCategory(o.categoria))
    );

    kpiTotal.textContent = String(sorted.length);
    kpiAtivas.textContent = String(activeCount);
    kpiPausadas.textContent = String(pausedCount);
    kpiCategorias.textContent = String(catSet.size);

    // Aplicar filtros da lista do painel
    const q = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const catFilter = filterCatSelect ? filterCatSelect.value : "all";
    const statusFilter = filterStatusSelect ? filterStatusSelect.value : "all";

    const filtered = sorted.filter((item) => {
      const cat = Utils.normalizeCategory(item.categoria);
      const matchesCat = catFilter === "all" || cat === catFilter;
      const isAtiva = item.ativo !== false;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isAtiva) ||
        (statusFilter === "paused" && !isAtiva);
      const matchesQuery =
        !q ||
        String(item.titulo || "").toLowerCase().includes(q) ||
        String(item.subcategoria || "").toLowerCase().includes(q);
      return matchesCat && matchesStatus && matchesQuery;
    });

    if (filtered.length === 0) {
      offersListEl.innerHTML = `
        <div class="offers-empty-state" style="grid-column: 1 / -1;">
          <p>${
            sorted.length === 0
              ? "Nenhuma promoção cadastrada ainda. Adicione acima ou clique em Importar 8 Ofertas Modelo!"
              : "Nenhuma promoção encontrada para este filtro."
          }</p>
        </div>
      `;
      return;
    }

    offersListEl.innerHTML = filtered
      .map((item) => {
        const catMeta = Utils.getCategoryMeta(item.categoria);
        const isAtiva = item.ativo !== false;
        const oldHtml =
          Utils.parsePrice(item.precoAntigo) > Utils.parsePrice(item.precoNovo)
            ? `<span class="old">R$ ${Utils.formatPriceBR(item.precoAntigo)}</span>`
            : "";
        return `
          <article class="admin-offer-item ${isAtiva ? "" : "is-paused"}" data-offer-id="${Utils.escapeHTML(item.id)}">
            <div class="admin-offer-thumb">
              <span class="admin-status-badge ${isAtiva ? "active" : "paused"}">
                ${isAtiva ? "Ativa no site" : "Pausada"}
              </span>
              <span class="offer-discount-badge ${Utils.isHotBadge(item.selo, item.seloDestaque) ? "badge-hot" : ""}">
                ${Utils.escapeHTML(Utils.calcBadge(item.precoAntigo, item.precoNovo, item.selo))}
              </span>
              ${Utils.buildOfferMediaHTML(item.imagem, item.titulo)}
            </div>
            <div class="admin-offer-info">
              <span class="admin-offer-cat-pill">${catMeta.tabLabel}</span>
              <h4>${Utils.escapeHTML(item.titulo)}</h4>
              <div class="admin-offer-prices">
                ${oldHtml}
                <span class="now">R$ ${Utils.formatPriceBR(item.precoNovo)}</span>
              </div>
              <div class="admin-offer-actions">
                <button type="button" class="btn-act" data-action="toggle">
                  ${isAtiva ? "⏸️ Pausar" : "👁️ Ativar"}
                </button>
                <button type="button" class="btn-act" data-action="edit">
                  ✏️ Editar
                </button>
                <button type="button" class="btn-act btn-act-del" data-action="delete">
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  if (offersListEl) {
    offersListEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      const itemEl = e.target.closest(".admin-offer-item");
      if (!btn || !itemEl) return;

      const id = itemEl.getAttribute("data-offer-id");
      const action = btn.getAttribute("data-action");
      const offer = allOffers.find((o) => o.id === id);
      if (!offer) return;

      if (action === "toggle") {
        toggleOfferActive(id);
      } else if (action === "edit") {
        loadOfferIntoForm(offer);
      } else if (action === "delete") {
        pendingDeleteId = id;
        deleteModalDesc.textContent = `Tem certeza que deseja excluir "${offer.titulo}"?`;
        deleteModal.classList.add("open");
      }
    });
  }

  if (btnCancelDelete) {
    btnCancelDelete.addEventListener("click", () => {
      pendingDeleteId = null;
      deleteModal.classList.remove("open");
    });
  }

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener("click", async () => {
      if (!pendingDeleteId) return;
      const idToDelete = pendingDeleteId;
      pendingDeleteId = null;
      deleteModal.classList.remove("open");
      try {
        await deleteOfferRecord(idToDelete);
        showToast("Promoção excluída!");
      } catch (err) {
        showToast("Erro ao excluir: " + err.message, true);
      }
    });
  }

  [searchInput, filterCatSelect, filterStatusSelect].forEach((el) => {
    if (el) {
      el.addEventListener("input", refreshOffersUI);
      el.addEventListener("change", refreshOffersUI);
    }
  });

  if (btnImportDefaults) {
    btnImportDefaults.addEventListener("click", importDefaultOffers);
  }

  // ==========================================================================
  // AUTENTICAÇÃO E SINCRONIZAÇÃO SUPABASE
  // ==========================================================================
  let currentAuthUserId = null;

  function translateAuthError(err) {
    const rawMsg = typeof err === "string" ? err : err && err.message ? err.message : "";
    const msg = rawMsg.toLowerCase();

    if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
      return "E-mail ou senha incorretos. Confira o usuário cadastrado no Supabase Authentication.";
    }
    if (msg.includes("email not confirmed")) {
      return "E-mail ainda não confirmado no Supabase. No painel do Supabase, habilite 'Auto Confirm User' ao criar o usuário.";
    }
    if (msg.includes("too many requests") || (err && err.status === 429)) {
      return "Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.";
    }
    if (msg.includes("failed to fetch") || msg.includes("network")) {
      return "Falha de conexão com o Supabase. Verifique sua internet e se a URL do projeto está correta.";
    }
    return "Não foi possível entrar. Verifique as credenciais e a conexão (" + (rawMsg || "erro desconhecido") + ").";
  }

  async function applyAuthSession(session) {
    if (session && session.user) {
      statusPill.classList.remove("is-locked");
      statusPill.classList.add("is-online");
      statusText.textContent = `Online (${session.user.email || "Lojista"})`;
      btnLogout.classList.remove("hidden");
      loginSection.classList.add("hidden");
      dashboardSection.classList.remove("hidden");

      if (currentAuthUserId !== session.user.id) {
        currentAuthUserId = session.user.id;
        await loadSupabaseOffers();
      }
      return;
    }

    currentAuthUserId = null;
    allOffers = [];
    statusPill.classList.remove("is-online");
    statusPill.classList.add("is-locked");
    statusText.textContent = "Login Necessário";
    btnLogout.classList.add("hidden");
    dashboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!sbState.client) return;

      loginErrorBox.classList.add("hidden");
      const btnSubmit = document.getElementById("btn-login-submit");
      try {
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Entrando...";
        const { data, error } = await sbState.client.auth.signInWithPassword({
          email: loginEmailInput.value.trim(),
          password: loginPassInput.value,
        });
        if (error) throw error;
        if (data && data.session) {
          await applyAuthSession(data.session);
        }
        showToast("Bem-vindo ao Painel da Bela Aliança!");
      } catch (err) {
        loginErrorBox.textContent = translateAuthError(err);
        loginErrorBox.classList.remove("hidden");
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Entrar no Painel de Ofertas";
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      if (!sbState.client) return;
      const { error } = await sbState.client.auth.signOut();
      if (error) {
        showToast("Erro ao sair: " + error.message, true);
        return;
      }
      await applyAuthSession(null);
      showToast("Você saiu do painel.");
    });
  }

  // Inicialização principal do painel
  async function bootAdminPanel() {
    renderPresetGallery();
    resetOfferForm();

    sbState = await Utils.initSupabase();

    if (sbState.configured && sbState.client) {
      statusPill.classList.add("is-online");
      statusText.textContent = "Supabase Online";

      sbState.client.auth.onAuthStateChange((_event, session) => {
        applyAuthSession(session).catch((err) => {
          showToast("Erro ao atualizar sessão: " + (err.message || err), true);
        });
      });

      const { data, error } = await sbState.client.auth.getSession();
      if (error) {
        showToast("Erro ao verificar sessão no Supabase: " + error.message, true);
      }
      await applyAuthSession(data ? data.session : null);
    } else {
      if (sbState && sbState.error) {
        showToast("Biblioteca do Supabase indisponível. Modo Local ativado.", true);
      }
      // Sem Supabase configurado ainda -> funciona em Modo Local neste navegador
      statusPill.classList.remove("is-online", "is-locked");
      statusText.textContent = "Modo Local";
      btnLogout.classList.add("hidden");
      dashboardSection.classList.remove("hidden");
      loginSection.classList.add("hidden");
      allOffers = getLocalDemoOffers();
      refreshOffersUI();
    }
  }

  bootAdminPanel().catch((err) => {
    showToast("Erro ao iniciar o painel: " + (err.message || err), true);
  });
});

