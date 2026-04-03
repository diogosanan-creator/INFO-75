const refs = {
  loginScreen: document.querySelector("#loginScreen"),
  appShell: document.querySelector("#appShell"),
  sidebar: document.querySelector(".sidebar"),
  loginForm: document.querySelector("#loginForm"),
  loginUser: document.querySelector("#loginUser"),
  loginPassword: document.querySelector("#loginPassword"),
  logoutButton: document.querySelector("#logoutButton"),
  themeToggle: document.querySelector("#themeToggle"),
  themeLabel: document.querySelector("#themeLabel"),
  mobileMenuToggle: document.querySelector("#mobileMenuToggle"),
  mobileMenuClose: document.querySelector("#mobileMenuClose"),
  fabMenu: document.querySelector("#fabMenu"),
  fabLogout: document.querySelector("#fabLogout"),
  toast: document.querySelector("#toast"),
  navItems: [...document.querySelectorAll(".nav-item")],
  panels: [...document.querySelectorAll(".tab-panel")],
  pageTitle: document.querySelector("#pageTitle"),
  pageEyebrow: document.querySelector("#pageEyebrow"),
  pageDescription: document.querySelector("#pageDescription"),
  sessionName: document.querySelector("#sessionName"),
  sessionRole: document.querySelector("#sessionRole"),
  sessionUserCard: document.querySelector("#sessionUserCard"),
  clienteForm: document.querySelector("#clienteForm"),
  clientesList: document.querySelector("#clientesList"),
  servicoForm: document.querySelector("#servicoForm"),
  servicoCliente: document.querySelector("#servicoCliente"),
  servicoFilters: [...document.querySelectorAll("#servicoFilters .filter-pill")],
  servicosList: document.querySelector("#servicosList"),
  visitaForm: document.querySelector("#visitaForm"),
  visitaCliente: document.querySelector("#visitaCliente"),
  visitaServicoSelect: document.querySelector("#visitaServicoSelect"),
  visitaServicoTrigger: document.querySelector("#visitaServicoTrigger"),
  visitaServicoLabel: document.querySelector("#visitaServicoLabel"),
  visitaServicoChecklist: document.querySelector("#visitaServicoChecklist"),
  visitaSelectedTags: document.querySelector("#visitaSelectedTags"),
  visitaFotoButton: document.querySelector("#visitaFotoButton"),
  visitaCameraButton: document.querySelector("#visitaCameraButton"),
  visitaFotoInput: document.querySelector("#visitaFotoInput"),
  visitaCameraInput: document.querySelector("#visitaCameraInput"),
  visitaPhotoPreview: document.querySelector("#visitaPhotoPreview"),
  visitasList: document.querySelector("#visitasList"),
  orcamentoForm: document.querySelector("#orcamentoForm"),
  orcamentoCliente: document.querySelector("#orcamentoCliente"),
  orcamentoNumero: document.querySelector("#orcamentoNumero"),
  quoteItemsBody: document.querySelector("#quoteItemsBody"),
  quoteTotals: document.querySelector("#quoteTotals"),
  addQuoteItem: document.querySelector("#addQuoteItem"),
  orcamentoShortcutButtons: [...document.querySelectorAll("[data-scroll-target]")],
  orcamentoFilters: [...document.querySelectorAll("#orcamentoFilters .filter-pill")],
  orcamentosList: document.querySelector("#orcamentosList"),
  financeiroForm: document.querySelector("#financeiroForm"),
  receitasTotal: document.querySelector("#receitasTotal"),
  despesasTotal: document.querySelector("#despesasTotal"),
  saldoTotal: document.querySelector("#saldoTotal"),
  orcamentoSummary: document.querySelector("#orcamentoSummary"),
  orcamentoFinanceList: document.querySelector("#orcamentoFinanceList"),
  financeiroFilters: [...document.querySelectorAll("#financeiroFilters .filter-pill")],
  financeiroList: document.querySelector("#financeiroList"),
  estoqueForm: document.querySelector("#estoqueForm"),
  estoqueTipos: document.querySelector("#estoqueTipos"),
  estoqueValor: document.querySelector("#estoqueValor"),
  estoqueBaixo: document.querySelector("#estoqueBaixo"),
  estoqueList: document.querySelector("#estoqueList"),
  reportServicos: document.querySelector("#reportServicos"),
  reportVisitas: document.querySelector("#reportVisitas"),
  reportOrcamentos: document.querySelector("#reportOrcamentos"),
  reportClientes: document.querySelector("#reportClientes"),
  reportSpotlight: document.querySelector("#reportSpotlight"),
  reportPulse: document.querySelector("#reportPulse"),
  reportGrid: document.querySelector("#reportGrid"),
  clienteSearch: document.querySelector("#clienteSearch"),
  servicoSearch: document.querySelector("#servicoSearch"),
  userForm: document.querySelector("#userForm"),
  usersList: document.querySelector("#usersList"),
  userSearch: document.querySelector("#userSearch"),
  exportBackupButton: document.querySelector("#exportBackupButton"),
  importBackupInput: document.querySelector("#importBackupInput"),
  adminPasswordForm: document.querySelector("#adminPasswordForm"),
  adminToolsCard: document.querySelector("#adminToolsCard"),
  auditCard: document.querySelector("#auditCard"),
  auditPeriod: document.querySelector("#auditPeriod"),
  auditPdfButton: document.querySelector("#auditPdfButton"),
  auditSummary: document.querySelector("#auditSummary"),
  recordModal: document.querySelector("#recordModal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalForm: document.querySelector("#modalForm"),
  modalFields: document.querySelector("#modalFields"),
  modalCloseButton: document.querySelector("#modalCloseButton"),
  modalCancelButton: document.querySelector("#modalCancelButton"),
};

const state = {
  db: {
    clientes: [],
    servicos: [],
    visitas: [],
    orcamentos: [],
    financeiro: [],
    estoque: [],
    users: [],
  },
  session: null,
  activeTab: "servicos",
  serviceFilter: "Todos",
  budgetFilter: "Todos",
  financeFilter: "Todos",
  clienteSearch: "",
  servicoSearch: "",
  userSearch: "",
  auditPeriod: "monthly",
  quoteDraftItems: [],
  modalState: null,
  auditItems: [],
  theme: localStorage.getItem("sanan-theme") || "light",
  mobileNavOpen: false,
  visitPhotoDrafts: [],
};

const todayIso = new Date().toISOString().slice(0, 10);
const modules = ["servicos", "visitas", "orcamento", "financeiro", "estoque", "relatorio", "clientes", "usuarios"];
const serviceStatuses = ["Pendente", "Em Andamento", "Concluído"];
const budgetStatuses = ["Pendente", "Aprovado", "Rejeitado", "Concluído"];
const pageMeta = {
  servicos: {
    eyebrow: "Operação técnica",
    description: "Controle atendimentos, acompanhe status e mantenha a operação técnica com ritmo profissional.",
  },
  visitas: {
    eyebrow: "Agenda de campo",
    description: "Organize visitas, proteja prazos de campo e mantenha o cliente informado com clareza.",
  },
  orcamento: {
    eyebrow: "Propostas comerciais",
    description: "Monte propostas com apresentação forte, valores consistentes e leitura comercial segura.",
  },
  financeiro: {
    eyebrow: "Saúde financeira",
    description: "Leia receitas, despesas e pendências com visão de caixa mais clara e mais vendável.",
  },
  estoque: {
    eyebrow: "Base de suprimentos",
    description: "Proteja reposição, evite atraso operacional e acompanhe o valor parado em estoque.",
  },
  relatorio: {
    eyebrow: "Visão executiva",
    description: "Acompanhe desempenho, demanda e conversão com uma leitura executiva da INFO75.",
  },
  clientes: {
    eyebrow: "Relacionamento",
    description: "Mantenha a base de clientes organizada e pronta para atendimento, orçamento e pós-venda.",
  },
  usuarios: {
    eyebrow: "Controle de acesso",
    description: "Controle acesso por função e preserve governança sem travar a operação do time.",
  },
};

function visibleTabs() {
  return modules.filter((moduleName) => hasPermission(moduleName, "view"));
}

function toast(message) {
  refs.toast.textContent = message;
  refs.toast.classList.add("visible");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => refs.toast.classList.remove("visible"), 2500);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function dateBr(value) {
  if (!value) return "-";
  const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem("sanan-theme", state.theme);
  if (refs.themeToggle) refs.themeToggle.checked = state.theme === "dark";
  if (refs.themeLabel) refs.themeLabel.textContent = state.theme === "dark" ? "Escuro" : "Claro";
}

function setMobileNav(open) {
  state.mobileNavOpen = Boolean(open);
  refs.sidebar?.classList.toggle("mobile-open", state.mobileNavOpen);
  document.body.classList.toggle("nav-open", state.mobileNavOpen);
}

function getSelectedVisitServices() {
  const inputs = refs.visitaServicoChecklist ? [...refs.visitaServicoChecklist.querySelectorAll("input[type='checkbox']:checked")] : [];
  return inputs.map((input) => input.value);
}

function setVisitServiceMenu(open) {
  const isOpen = Boolean(open);
  refs.visitaServicoSelect?.classList.toggle("open", isOpen);
  refs.visitaServicoTrigger?.setAttribute("aria-expanded", String(isOpen));
  refs.visitaServicoChecklist?.classList.toggle("hidden", !isOpen);
}

function renderVisitServiceSelection() {
  const selected = getSelectedVisitServices();
  if (refs.visitaServicoLabel) refs.visitaServicoLabel.textContent = selected.length ? selected.join(", ") : "Selecione um ou mais servi\u00e7os";
  if (refs.visitaSelectedTags) {
    refs.visitaSelectedTags.innerHTML = "";
  }
  refs.visitaServicoChecklist?.querySelectorAll(".visita-option").forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("selected", Boolean(input?.checked));
  });
}

function resetVisitPhotoDrafts() {
  state.visitPhotoDrafts = [];
  if (refs.visitaFotoInput) refs.visitaFotoInput.value = "";
  renderVisitPhotoPreview();
}

function renderVisitPhotoPreview() {
  if (!refs.visitaPhotoPreview) return;
  refs.visitaPhotoPreview.innerHTML = state.visitPhotoDrafts.length
    ? state.visitPhotoDrafts.map((photo, index) => `<article class="visita-photo-card"><img src="${photo.dataUrl}" alt="Foto da visita ${index + 1}"><button class="outline-button small-action danger-action" data-remove-visit-photo="${index}" type="button">Remover</button></article>`).join("")
    : `<div class="visita-photo-empty">Nenhuma foto anexada.</div>`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Nao foi possivel ler a foto selecionada."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Nao foi possivel processar a foto selecionada."));
    image.src = dataUrl;
  });
}

function createClientId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function compressVisitPhoto(file) {
  const source = await fileToDataUrl(file);
  const image = await loadImage(source);
  const maxSide = 960;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

async function handleVisitPhotoSelection(files) {
  const incoming = [...files].slice(0, Math.max(0, 4 - state.visitPhotoDrafts.length));
  if (!incoming.length) {
    toast("Voce pode anexar ate 4 fotos por visita.");
    return;
  }

  try {
    const photos = [];
    for (const file of incoming) {
      if (!file.type.startsWith("image/")) continue;
      // Comprime antes do envio para caber melhor no armazenamento local.
      const dataUrl = await compressVisitPhoto(file);
      photos.push({ id: createClientId(), dataUrl });
    }
    state.visitPhotoDrafts = [...state.visitPhotoDrafts, ...photos].slice(0, 4);
    renderVisitPhotoPreview();
  } catch (error) {
    toast(error.message || "Falha ao anexar foto.");
  } finally {
    if (refs.visitaFotoInput) refs.visitaFotoInput.value = "";
  }
}
function byNewest(a, b) {
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
}

function normalizeStatus(status) {
  const value = String(status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (value.startsWith("conclu")) return "Concluído";
  if (value === "em andamento") return "Em Andamento";
  if (value === "aprovado") return "Aprovado";
  if (value === "rejeitado") return "Rejeitado";
  if (value === "cancelado") return "Cancelado";
  if (value === "pago") return "Pago";
  return status || "Pendente";
}

function badge(status) {
  const value = normalizeStatus(status);
  if (["Concluído", "Aprovado", "Pago"].includes(value)) return "success";
  if (["Em Andamento"].includes(value)) return "info";
  if (["Rejeitado", "Cancelado"].includes(value)) return "danger";
  return "warning";
}

function roleLabel(role) {
  return role === "admin" ? "Administrador" : "Técnico";
}

function accessList(user) {
  const items = modules.filter((moduleName) => user.permissions?.[moduleName]?.view);
  return items.length ? items.join(", ") : "Sem acessos";
}

function find(collection, id) {
  return state.db[collection].find((item) => item.id === id);
}

function hasPermission(moduleName, level = "view") {
  if (!state.session) return false;
  if (state.session.role === "admin") return true;
  if (moduleName === "usuarios") return false;
  return Boolean(state.session.permissions?.[moduleName]?.[level]);
}

function tabCanEdit(moduleName) {
  return hasPermission(moduleName, "edit");
}

function readPermissionsFromForm(form) {
  return Object.fromEntries(modules.map((moduleName) => [moduleName, {
    view: form.querySelector(`[name="perm_${moduleName}_view"]`)?.checked || false,
    edit: form.querySelector(`[name="perm_${moduleName}_edit"]`)?.checked || false,
  }]));
}

function applyPermissionDependencies(root = document) {
  if (!root) return;
  modules.forEach((moduleName) => {
    const viewInput = root.querySelector(`[name="perm_${moduleName}_view"]`);
    const editInput = root.querySelector(`[name="perm_${moduleName}_edit"]`);
    if (!viewInput || !editInput) return;
    editInput.disabled = !viewInput.checked;
    if (!viewInput.checked) editInput.checked = false;
  });
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(typeof payload === "object" && payload?.error ? payload.error : "Falha na requisição.");
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function refreshState() {
  const payload = await api("/api/bootstrap", { method: "GET", headers: {} });
  state.db = payload.data;
  state.session = payload.session;
  if (state.session?.role === "admin") {
    try {
      const auditPayload = await api("/api/admin/audit", { method: "GET", headers: {} });
      state.auditItems = auditPayload.items || [];
    } catch {
      state.auditItems = [];
    }
  } else {
    state.auditItems = [];
  }
  renderAll();
}

function setTab(tab) {
  if (!visibleTabs().includes(tab)) {
    state.activeTab = visibleTabs()[0] || "servicos";
  } else {
    state.activeTab = tab;
  }
  refs.navItems.forEach((item) => {
    const isVisible = visibleTabs().includes(item.dataset.tab);
    item.classList.toggle("hidden", !isVisible);
    item.classList.toggle("active", item.dataset.tab === state.activeTab);
  });
  refs.panels.forEach((item) => item.classList.toggle("active", item.dataset.panel === state.activeTab));
  const currentLabel = refs.navItems.find((item) => item.dataset.tab === state.activeTab)?.textContent.trim() || "Serviços";
  const currentMeta = pageMeta[state.activeTab] || pageMeta.servicos;
  refs.pageTitle.textContent = currentLabel;
  if (refs.pageEyebrow) refs.pageEyebrow.textContent = currentMeta.eyebrow;
  if (refs.pageDescription) refs.pageDescription.textContent = currentMeta.description;
  if (window.innerWidth <= 920) setMobileNav(false);
}

function renderSession() {
  const loggedIn = Boolean(state.session);
  refs.loginScreen.classList.toggle("hidden", loggedIn);
  refs.appShell.classList.toggle("hidden", !loggedIn);
  if (!loggedIn) return;
  refs.sessionName.textContent = state.session.nome;
  refs.sessionRole.textContent = roleLabel(state.session.role);
  refs.sessionUserCard.querySelector(".user-avatar").textContent = state.session.nome.charAt(0).toUpperCase();
  setTab(state.activeTab);
  refs.userForm?.classList.toggle("hidden", !hasPermission("usuarios", "edit"));
}

function modal({ title, fields, values, onSubmit }) {
  state.modalState = { onSubmit };
  refs.modalTitle.textContent = title;
  refs.modalFields.innerHTML = fields.map((field) => {
    const current = values[field.name] ?? "";
    if (field.type === "select") {
      return `<label class="${field.full ? "full" : ""}"><span>${field.label}</span><select name="${field.name}" ${field.required ? "required" : ""}>${field.options.map((option) => `<option value="${esc(option)}" ${String(current) === option ? "selected" : ""}>${esc(option)}</option>`).join("")}</select></label>`;
    }
    if (field.type === "textarea") {
      return `<label class="${field.full ? "full" : ""}"><span>${field.label}</span><textarea name="${field.name}" rows="${field.rows || 4}" ${field.required ? "required" : ""}>${esc(current)}</textarea></label>`;
    }
    return `<label class="${field.full ? "full" : ""}"><span>${field.label}</span><input type="${field.type || "text"}" name="${field.name}" value="${esc(current)}" ${field.required ? "required" : ""}></label>`;
  }).join("");
  refs.recordModal.classList.remove("hidden");
}

function closeModal() {
  refs.recordModal.classList.add("hidden");
  refs.modalFields.innerHTML = "";
  refs.modalForm.reset();
  state.modalState = null;
}
function draftItem(item = {}) { return { id: item.id || createClientId(), descricao: item.descricao || "", unidade: item.unidade || "un", quantidade: Number(item.quantidade || 1), valorUnitario: Number(item.valorUnitario || 0) }; }
function quoteTotals() { const subtotal = state.quoteDraftItems.reduce((sum, item) => sum + item.quantidade * item.valorUnitario, 0); return { subtotal, total: subtotal }; }
function renderQuoteDraft() {
  refs.quoteItemsBody.innerHTML = state.quoteDraftItems.map((item) => `<tr class="quote-draft-row" data-item-id="${item.id}"><td data-label="Descrição"><input type="text" data-field="descricao" value="${esc(item.descricao)}" placeholder="Descrição do material ou serviço"></td><td data-label="Unidade"><input type="text" data-field="unidade" value="${esc(item.unidade)}"></td><td data-label="Quantidade"><input type="number" data-field="quantidade" min="1" value="${item.quantidade}"></td><td data-label="Valor unitário"><input type="number" data-field="valorUnitario" min="0" step="0.01" value="${item.valorUnitario}"></td><td class="text-center" data-label="Ação"><button class="outline-button quote-remove small-action" type="button">Excluir</button></td></tr>`).join("");
  const totals = quoteTotals();
  refs.quoteTotals.innerHTML = `<p>Subtotal <strong>${money(totals.subtotal)}</strong></p><p>Desconto (%) <strong>0%</strong></p><p class="grand-total">TOTAL <strong>${money(totals.total)}</strong></p>`;
}
function nextBudgetNumber() { return String(state.db.orcamentos.reduce((max, item) => Math.max(max, Number(item.numero || 0)), 0) + 1); }
function resetQuoteForm() {
  refs.orcamentoForm.reset();
  refs.orcamentoForm.querySelector("[name='data']").value = todayIso;
  refs.orcamentoNumero.value = nextBudgetNumber();
  delete refs.orcamentoForm.dataset.editingId;
  state.quoteDraftItems = [draftItem()];
  renderQuoteDraft();
}

function renderSelects() {
  const options = state.db.clientes.map((cliente) => `<option value="${cliente.id}">${esc(cliente.nome)}</option>`).join("");
  const placeholder = `<option value="">${state.db.clientes.length ? "Selecione a empresa" : "Cadastre um cliente primeiro"}</option>`;
  refs.servicoCliente.innerHTML = placeholder + options;
  refs.visitaCliente.innerHTML = placeholder + options;
  refs.orcamentoCliente.innerHTML = `<option value="">${state.db.clientes.length ? "Selecione o cliente" : "Cadastre um cliente primeiro"}</option>` + options;
}

function renderClientes() {
  const query = state.clienteSearch.trim().toLowerCase();
  const items = state.db.clientes.filter((cliente) => !query || [cliente.nome, cliente.email, cliente.telefone, cliente.responsavel].some((value) => String(value || "").toLowerCase().includes(query)));
  refs.clientesList.innerHTML = items.length
    ? [...items].sort(byNewest).map((cliente) => `<article class="client-card"><div class="card-actions"><button class="outline-button small-action" data-action="edit-cliente" data-id="${cliente.id}" type="button">Editar</button><button class="outline-button small-action danger-action" data-action="delete-cliente" data-id="${cliente.id}" type="button">Excluir</button></div><h4>${esc(cliente.nome)}</h4><div class="meta-chip-row"><span class="meta-chip">${esc(cliente.responsavel || "Sem responsável")}</span><span class="meta-chip">${esc(cliente.telefone || "Sem telefone")}</span></div><div class="client-meta"><p><strong>Email:</strong> ${esc(cliente.email || "-")}</p><p><strong>Endereço:</strong> ${esc(cliente.endereco || "-")}</p></div></article>`).join("")
    : `<article class="empty-state"><strong>Nenhum cliente cadastrado.</strong></article>`;
}

function renderServicos() {
  const query = state.servicoSearch.trim().toLowerCase();
  const items = state.db.servicos.filter((item) => (state.serviceFilter === "Todos" || normalizeStatus(item.status) === state.serviceFilter) && (!query || [item.cliente, item.tipo, item.observacoes].some((value) => String(value || "").toLowerCase().includes(query)))).sort(byNewest);
  refs.servicosList.innerHTML = items.length
    ? items.map((item) => {
      const status = normalizeStatus(item.status);
      return `<article class="service-entry"><div class="service-main"><h4>${esc(item.cliente)}</h4><p>${esc(item.tipo)}</p><small>${esc(item.observacoes || "Sem observações registradas.")}</small><div class="service-meta"><span>Abertura: ${dateBr(item.createdAt?.slice(0, 10))}</span><span>Fluxo: atendimento técnico</span></div></div><div class="entry-side"><span class="status-badge ${badge(status)}">${esc(status)}</span><select data-service-id="${item.id}" class="service-status-select">${serviceStatuses.map((entry) => `<option ${entry === status ? "selected" : ""}>${entry}</option>`).join("")}</select><div class="inline-actions"><button class="outline-button small-action" data-action="edit-servico" data-id="${item.id}" type="button">Editar</button><button class="outline-button small-action" data-action="pdf-os" data-id="${item.id}" type="button">OS PDF</button><button class="outline-button small-action danger-action" data-action="delete-servico" data-id="${item.id}" type="button">Excluir</button></div></div></article>`;
    }).join("")
    : `<article class="empty-state"><strong>Nenhum serviço encontrado.</strong></article>`;
}

function renderVisitas() {
  refs.visitasList.innerHTML = state.db.visitas.length
    ? [...state.db.visitas].sort(byNewest).map((item) => `<article class="service-entry"><div class="service-main"><h4>${esc(item.cliente)}</h4><p>${esc(item.servico)}</p><small>${esc(item.observacoes || "Sem observações registradas.")}</small>${Array.isArray(item.fotos) && item.fotos.length ? `<div class="visita-gallery">${item.fotos.map((foto, index) => `<figure class="visita-gallery-item"><img src="${foto.dataUrl}" alt="Foto da visita ${index + 1}"></figure>`).join("")}</div>` : ""}<div class="service-meta"><span>Data da visita: ${dateBr(item.data)}</span><span>Agenda em campo</span></div></div><div class="entry-side"><span class="status-badge info">Agendada</span><div class="inline-actions"><button class="outline-button small-action" data-action="edit-visita" data-id="${item.id}" type="button">Editar</button><button class="outline-button small-action danger-action" data-action="delete-visita" data-id="${item.id}" type="button">Excluir</button></div></div></article>`).join("")
    : `<article class="empty-state"><strong>Nenhuma visita cadastrada.</strong></article>`;
}

function renderOrcamentos() {
  const items = state.db.orcamentos.filter((item) => state.budgetFilter === "Todos" || normalizeStatus(item.status) === state.budgetFilter).sort(byNewest);
  refs.orcamentosList.innerHTML = items.length
    ? items.map((item) => {
      const status = normalizeStatus(item.status);
      return `<article class="expanded-card"><div class="expanded-top"><div class="expanded-title"><h4>${esc(item.cliente)}</h4><span>${dateBr(item.data)}</span><span>${esc(item.preparadoPor || "Sem responsável definido")}</span></div><div class="expanded-meta"><strong>${money(item.total)}</strong><span class="status-badge ${badge(status)}">${esc(status)}</span></div></div><div class="action-row"><button class="outline-button small-action" data-action="edit-orcamento" data-id="${item.id}" type="button">Editar</button><button class="outline-button small-action" data-action="pdf-orcamento" data-id="${item.id}" type="button">PDF</button><button class="outline-button small-action danger-action" data-action="delete-orcamento" data-id="${item.id}" type="button">Excluir</button></div><div class="detail-grid"><div><span>Endereço</span><strong>${esc(item.endereco || "-")}</strong></div><div><span>Telefone</span><strong>${esc(item.telefone || "-")}</strong></div><div><span>Termos</span><strong>${esc(item.termos || "-")}</strong></div><div><span>Técnico</span><strong>${esc(item.tecnico || "-")}</strong></div></div><div class="comment-box">Observações: ${esc(item.comentarios || "Sem observações registradas.")}</div><table class="quote-table"><thead><tr><th>Descrição / Material</th><th>Unidade</th><th>Qtd</th><th>Unitário</th><th>Total</th></tr></thead><tbody>${item.itens.map((entry) => `<tr><td>${esc(entry.descricao)}</td><td>${esc(entry.unidade)}</td><td>${entry.quantidade}</td><td>${money(entry.valorUnitario)}</td><td>${money(entry.quantidade * entry.valorUnitario)}</td></tr>`).join("")}</tbody></table><div class="totals-box"><p>Subtotal <strong>${money(item.subtotal)}</strong></p><p>Desconto (%) <strong>0%</strong></p><p class="grand-total">TOTAL <strong>${money(item.total)}</strong></p></div></article>`;
    }).join("")
    : `<article class="empty-state"><strong>Nenhum orçamento cadastrado.</strong></article>`;
}

function renderFinanceiro() {
  const receitas = state.db.financeiro.filter((item) => item.tipo === "Receita" && item.status !== "Cancelado").reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const despesas = state.db.financeiro.filter((item) => item.tipo === "Despesa" && item.status !== "Cancelado").reduce((sum, item) => sum + Number(item.valor || 0), 0);
  refs.receitasTotal.textContent = money(receitas);
  refs.despesasTotal.textContent = money(despesas);
  refs.saldoTotal.textContent = money(receitas - despesas);
  refs.orcamentoSummary.innerHTML = budgetStatuses.map((status) => {
    const items = state.db.orcamentos.filter((item) => normalizeStatus(item.status) === status);
    const total = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const color = status === "Aprovado" ? "green" : status === "Rejeitado" ? "red" : status === "Concluído" ? "blue" : "yellow";
    return `<article class="summary-card ${color}"><span>${status.toUpperCase()}</span><strong>${money(total)}</strong><small>${items.length} orçamento(s)</small></article>`;
  }).join("");
  const approved = state.db.orcamentos.filter((item) => normalizeStatus(item.status) === "Aprovado");
  refs.orcamentoFinanceList.innerHTML = approved.length ? approved.map((item) => `<div><strong>${esc(item.cliente)}</strong><span>${money(item.total)}</span><em>${esc(normalizeStatus(item.status))}</em></div>`).join("") : `<div><strong>Nenhum orçamento aprovado</strong><span>${money(0)}</span><em>-</em></div>`;
  const items = state.db.financeiro.filter((item) => state.financeFilter === "Todos" || item.tipo === state.financeFilter).sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));
  refs.financeiroList.innerHTML = items.length ? items.map((item) => `<div><strong>${esc(item.descricao)}</strong><span>${money(item.valor)}</span><em>${esc(item.tipo)} | ${esc(normalizeStatus(item.status))} | ${dateBr(item.data)}</em><div class="inline-actions"><button class="outline-button small-action" data-action="edit-financeiro" data-id="${item.id}" type="button">Editar</button><button class="outline-button small-action danger-action" data-action="delete-financeiro" data-id="${item.id}" type="button">Excluir</button></div></div>`).join("") : `<div><strong>Nenhum lançamento</strong><span>${money(0)}</span><em>-</em></div>`;
}

function renderEstoque() {
  refs.estoqueTipos.textContent = String(state.db.estoque.length);
  refs.estoqueValor.textContent = money(state.db.estoque.reduce((sum, item) => sum + Number(item.valor || 0) * Number(item.quantidade || 0), 0));
  refs.estoqueBaixo.textContent = `${state.db.estoque.filter((item) => Number(item.quantidade) <= Number(item.minimo)).length} itens`;
  refs.estoqueList.innerHTML = state.db.estoque.length ? [...state.db.estoque].sort(byNewest).map((item) => `<article class="service-entry"><div class="service-main"><h4>${esc(item.nome)}</h4><p>${esc(item.categoria || "Sem categoria")}</p><small>Fornecedor: ${esc(item.fornecedor || "-")}</small><div class="service-meta"><span>Quantidade: ${item.quantidade}</span><span>Mínimo: ${item.minimo}</span></div></div><div class="entry-side"><span class="status-badge ${Number(item.quantidade) <= Number(item.minimo) ? "warning" : "success"}">${Number(item.quantidade) <= Number(item.minimo) ? "Reposição" : "Estável"}</span><span>${money(item.valor)}</span><div class="inline-actions"><button class="outline-button small-action" data-action="edit-estoque" data-id="${item.id}" type="button">Editar</button><button class="outline-button small-action danger-action" data-action="delete-estoque" data-id="${item.id}" type="button">Excluir</button></div></div></article>`).join("") : `<article class="empty-state"><strong>Nenhum item no estoque.</strong></article>`;
}

function renderRelatorios() {
  refs.reportServicos.textContent = String(state.db.servicos.length);
  refs.reportVisitas.textContent = String(state.db.visitas.length);
  refs.reportOrcamentos.textContent = String(state.db.orcamentos.length);
  refs.reportClientes.textContent = String(state.db.clientes.length);
  const servicosAtivos = state.db.servicos.filter((item) => normalizeStatus(item.status) !== "Concluído").length;
  const orcamentosAprovados = state.db.orcamentos.filter((item) => normalizeStatus(item.status) === "Aprovado").length;
  const financeiroPendente = state.db.financeiro.filter((item) => normalizeStatus(item.status) === "Pendente").length;
  const estoqueBaixo = state.db.estoque.filter((item) => Number(item.quantidade) <= Number(item.minimo)).length;
  if (refs.reportSpotlight) {
    refs.reportSpotlight.textContent = servicosAtivos
      ? `${servicosAtivos} serviço(s) ainda exigem andamento técnico. ${orcamentosAprovados} orçamento(s) já estão aprovados e ${financeiroPendente} lançamento(s) seguem pendentes.`
      : `A operação está sob controle: não há serviços abertos no momento, com ${orcamentosAprovados} orçamento(s) aprovados e ${financeiroPendente} pendência(s) financeira(s) monitorada(s).`;
  }
  if (refs.reportPulse) {
    refs.reportPulse.innerHTML = `<article class="pulse-card"><span>Ritmo atual</span><strong>${servicosAtivos}</strong><p>Chamados ativos aguardando solução, retorno ou encerramento.</p></article><article class="pulse-card"><span>Conversão</span><strong>${orcamentosAprovados}</strong><p>Propostas já aprovadas e com potencial imediato de receita.</p></article><article class="pulse-card"><span>Reposição</span><strong>${estoqueBaixo}</strong><p>Itens abaixo do mínimo que podem afetar velocidade de atendimento.</p></article>`;
  }
  refs.reportGrid.innerHTML = `<article class="report-card"><span class="report-label">Operação</span><strong>Serviços em andamento</strong><span class="report-metric">${servicosAtivos}</span><p>Chamados ainda pedem andamento técnico, retorno ao cliente ou encerramento formal.</p></article><article class="report-card"><span class="report-label">Comercial</span><strong>Orçamentos aprovados</strong><span class="report-metric">${orcamentosAprovados}</span><p>Propostas aprovadas indicam receita mais quente e merecem acompanhamento próximo.</p></article><article class="report-card"><span class="report-label">Financeiro</span><strong>Lançamentos pendentes</strong><span class="report-metric">${financeiroPendente}</span><p>Valores ainda sem baixa precisam de cobrança, confirmação ou revisão do fluxo.</p></article><article class="report-card"><span class="report-label">Estoque</span><strong>Itens em reposição</strong><span class="report-metric">${estoqueBaixo}</span><p>Estoque abaixo do mínimo pode atrasar atendimento e reduzir previsibilidade operacional.</p></article>`;
}

function renderUsers() {
  if (!refs.usersList) return;
  const query = state.userSearch.trim().toLowerCase();
  const items = (state.db.users || []).filter((user) => !query || [user.nome, user.username, user.role].some((value) => String(value || "").toLowerCase().includes(query)));
  refs.usersList.innerHTML = items.length ? items.map((user) => `<article class="client-card"><div class="card-actions">${hasPermission("usuarios", "edit") ? `<button class="outline-button small-action" data-action="edit-user" data-id="${user.id}" type="button">Editar</button><button class="outline-button small-action danger-action" data-action="delete-user" data-id="${user.id}" type="button">Excluir</button>` : ""}</div><h4>${esc(user.nome)}</h4><div class="meta-chip-row"><span class="meta-chip">${esc(user.username)}</span><span class="meta-chip">${esc(roleLabel(user.role))}</span></div><div class="client-meta"><p><strong>Acessos:</strong> ${esc(accessList(user))}</p></div></article>`).join("") : `<article class="empty-state"><strong>Nenhum usuário cadastrado.</strong></article>`;
}

function auditPeriodLabel(period) {
  if (period === "daily") return "Diário (últimas 24 horas)";
  if (period === "weekly") return "Semanal (últimos 7 dias)";
  return "Mensal (últimos 30 dias)";
}

function auditPeriodRange(period) {
  const end = new Date();
  const start = new Date(end);
  if (period === "daily") start.setDate(end.getDate() - 1);
  else if (period === "weekly") start.setDate(end.getDate() - 7);
  else start.setDate(end.getDate() - 30);
  return { start: start.getTime(), end: end.getTime() };
}

function filterAuditByPeriod(period = state.auditPeriod) {
  const { start, end } = auditPeriodRange(period);
  return state.auditItems.filter((item) => {
    const stamp = item.timestamp ? new Date(item.timestamp).getTime() : null;
    return stamp != null && stamp >= start && stamp <= end;
  });
}

function renderAudit() {
  refs.adminToolsCard?.classList.toggle("hidden", state.session?.role !== "admin");
  refs.auditCard?.classList.toggle("hidden", state.session?.role !== "admin");
  if (refs.auditPeriod) refs.auditPeriod.value = state.auditPeriod;
  const items = filterAuditByPeriod();
  if (refs.auditSummary) {
    refs.auditSummary.innerHTML = `<p><strong>${items.length}</strong> evento(s) prontos para relatório <strong>${auditPeriodLabel(state.auditPeriod)}</strong>.</p>`;
  }
}

function openAuditPdfReport() {
  const items = filterAuditByPeriod();
  if (!items.length) {
    toast("Não há eventos no período selecionado.");
    return;
  }
  const rows = items.map((item) => {
    const when = item.timestamp ? new Date(item.timestamp).toLocaleString("pt-BR") : "-";
    return `<tr><td>${esc(when)}</td><td>${esc(item.action || "-")}</td><td>${esc(item.actor || item.username || "-")}</td><td>${esc(item.targetId || item.file || item.ip || "-")}</td></tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Auditoria</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f1f6fc;color:#0f2035;font-family:Inter,Arial,sans-serif}
    .page{max-width:1080px;margin:0 auto;padding:24px}.toolbar{display:flex;justify-content:flex-end;margin-bottom:12px}
    .btn{border:0;border-radius:12px;padding:11px 16px;background:linear-gradient(135deg,#143d73,#1b6db0,#46d3d7);color:#fff;font-weight:700}
    .card{background:#fff;border:1px solid #d6e4f3;border-radius:16px;padding:18px;box-shadow:0 12px 24px rgba(20,61,115,.08)}
    h1{margin:0 0 8px;font-size:24px}.muted{margin:0;color:#5f7692}table{width:100%;border-collapse:collapse;margin-top:14px}
    th,td{padding:10px;border-bottom:1px solid #dbe7f4;text-align:left;font-size:13px;vertical-align:top}thead{background:#edf5fd}
    @media print{.toolbar{display:none}.page{padding:0}.card{border:none;box-shadow:none}}
  </style></head><body><div class="page"><div class="toolbar"><button class="btn" type="button" onclick="window.print()">🖨️ Imprimir PDF</button></div><article class="card"><h1>Relatório de Auditoria</h1><p class="muted">Período: ${auditPeriodLabel(state.auditPeriod)} | Eventos: ${items.length} | Emitido em ${new Date().toLocaleString("pt-BR")}</p><table><thead><tr><th>Data e hora</th><th>Ação</th><th>Usuário</th><th>Alvo</th></tr></thead><tbody>${rows}</tbody></table></article></div></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank");
  if (!tab) toast("Não foi possível abrir o relatório. Libere pop-up no navegador.");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function applyAccessControl() {
  const controlMap = [
    { moduleName: "clientes", form: refs.clienteForm, containers: [refs.clientesList] },
    { moduleName: "servicos", form: refs.servicoForm, containers: [refs.servicosList] },
    { moduleName: "visitas", form: refs.visitaForm, containers: [refs.visitasList] },
    { moduleName: "orcamento", form: refs.orcamentoForm, containers: [refs.orcamentosList] },
    { moduleName: "financeiro", form: refs.financeiroForm, containers: [refs.financeiroList] },
    { moduleName: "estoque", form: refs.estoqueForm, containers: [refs.estoqueList] },
    { moduleName: "usuarios", form: refs.userForm, containers: [refs.usersList] },
  ];

  controlMap.forEach(({ moduleName, form, containers }) => {
    const canEdit = tabCanEdit(moduleName);
    if (form) [...form.elements].forEach((element) => {
      if (element.type !== "hidden") element.disabled = !canEdit;
    });
    containers.forEach((container) => {
      if (!container) return;
      container.querySelectorAll("button, select, input, textarea").forEach((element) => {
        if (element.classList.contains("filter-pill")) return;
        if (element.dataset.action || element.classList.contains("service-status-select") || element.classList.contains("quote-remove")) {
          element.disabled = !canEdit;
        }
      });
    });
  });
}

function renderAll() {
  renderSession();
  renderSelects();
  renderClientes();
  renderServicos();
  renderVisitas();
  renderOrcamentos();
  renderFinanceiro();
  renderEstoque();
  renderRelatorios();
  renderUsers();
  renderAudit();
  applyAccessControl();
}

function loadBudgetIntoForm(id) {
  const item = find("orcamentos", id);
  if (!item) return;
  setTab("orcamento");
  refs.orcamentoCliente.value = item.clienteId || "";
  refs.orcamentoForm.querySelector("[name='endereco']").value = item.endereco || "";
  refs.orcamentoForm.querySelector("[name='telefone']").value = item.telefone || "";
  refs.orcamentoForm.querySelector("[name='numero']").value = item.numero || "";
  refs.orcamentoForm.querySelector("[name='status']").value = normalizeStatus(item.status) || "Pendente";
  refs.orcamentoForm.querySelector("[name='data']").value = item.data || todayIso;
  refs.orcamentoForm.querySelector("[name='validade']").value = item.validade || "";
  refs.orcamentoForm.querySelector("[name='preparadoPor']").value = item.preparadoPor || "";
  refs.orcamentoForm.querySelector("[name='tecnico']").value = item.tecnico || "";
  refs.orcamentoForm.querySelector("[name='ocNumero']").value = item.ocNumero || "";
  refs.orcamentoForm.querySelector("[name='resumo']").value = item.resumo || "";
  refs.orcamentoForm.querySelector("[name='termos']").value = item.termos || "";
  refs.orcamentoForm.querySelector("[name='comentarios']").value = item.comentarios || "";
  state.quoteDraftItems = item.itens.map((entry) => draftItem(entry));
  refs.orcamentoForm.dataset.editingId = id;
  renderQuoteDraft();
}

function printAssetUrl(relativePath) {
  return new URL(relativePath, window.location.href).href;
}

function printDoc(title, body, accent = "ORÇAMENTO") {
  const logoUrl = printAssetUrl("./assets/logo-info75.jpg");
  const documentMarkup = `<article class="sheet"><style>
    :root{--green:#1b6db0;--green-deep:#143d73;--green-soft:#e8f2ff;--ink:#112033;--muted:#657489;--line:#cfdae8;--cyan:#46d3d7;--cyan-soft:#e9fbff}
    *{box-sizing:border-box}
    html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .sheet{max-width:980px;margin:0 auto;padding:26px;font-family:Inter,Arial,sans-serif;color:var(--ink);background:radial-gradient(circle at top left,#dff7ff,transparent 26%),linear-gradient(180deg,#edf3fb,#f7fbff)}
    .hero{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px 30px;border-radius:30px;background:linear-gradient(135deg,#0b2341 0%, #143d73 46%, #1b6db0 78%, #46d3d7 100%);color:#fff;box-shadow:0 24px 50px rgba(17,32,51,.18);overflow:hidden}
    .hero:after{content:"";position:absolute;right:-90px;top:-90px;width:240px;height:240px;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 68%)}
    .brand{display:flex;align-items:center;gap:18px}
    .brand img{width:86px;height:86px;object-fit:contain;border-radius:20px;background:#fff;padding:10px;box-shadow:0 12px 24px rgba(0,0,0,.16)}
    .brand h1{margin:0;font-size:29px;letter-spacing:.06em}
    .brand p,.hero-note p,.hero-note span{margin:0;color:rgba(255,255,255,.8)}
    .hero-note{display:grid;gap:8px;text-align:right}
    .hero-note strong{font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#d9fafe}
    .content{margin-top:18px;padding:24px;border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(233,248,255,.94));box-shadow:0 18px 36px rgba(17,32,51,.08)}
    .content-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
    .doc-chip{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border-radius:999px;background:linear-gradient(135deg,var(--cyan-soft),#ffffff);border:1px solid rgba(27,109,176,.14);color:var(--green-deep);font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
    .doc-chip:before{content:"";width:10px;height:10px;border-radius:999px;background:linear-gradient(135deg,var(--green),var(--cyan))}
    .doc-title{font-size:14px;color:var(--muted);text-align:right}
    .meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:18px}
    .box,.section{padding:18px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#ffffff,#f5fbff);box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
    .box h2,.section h2{margin:0 0 12px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--green-deep)}
    .box p,.section p{margin:0 0 8px;line-height:1.5}
    .table-card{margin-top:18px;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:#fff}
    table{width:100%;border-collapse:collapse}
    thead{background:linear-gradient(135deg,var(--green-deep),var(--green));color:#fff}
    th,td{padding:12px 14px;text-align:left;border-bottom:1px solid var(--line)}
    tbody tr:nth-child(even){background:#f4f8fe}
    tbody tr:hover{background:#edf9ff}
    .split-note{display:grid;grid-template-columns:1.2fr .8fr;gap:16px;margin-top:18px}
    .mini-panel{padding:16px 18px;border-radius:18px;background:linear-gradient(180deg,#ffffff,#f4fbff);border:1px solid var(--line)}
    .mini-panel h3{margin:0 0 10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--green-deep)}
    .mini-panel p{margin:0;line-height:1.6;color:var(--muted)}
    .total-card{margin-top:18px;padding:20px 22px;border-radius:20px;background:linear-gradient(135deg,var(--green-deep),var(--green),var(--cyan));border:1px solid var(--green-deep);text-align:right;color:#fff;box-shadow:0 18px 32px rgba(20,61,115,.18)}
    .total-card span{display:block;color:rgba(255,255,255,.8);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
    .total-card strong{display:block;margin-top:8px;font-size:30px;color:#fff}
    .accent-rule{height:8px;margin:18px 0 0;border-radius:999px;background:linear-gradient(90deg,var(--green-deep),var(--green),var(--cyan))}
    .footer{margin-top:18px;display:flex;justify-content:space-between;gap:16px;color:var(--muted);font-size:12px}
    .footer strong{color:var(--green-deep)}
    @media print{.sheet{padding:0}}
  </style><header class="hero"><div class="brand"><img src="${logoUrl}" alt="Logo INFO75"><div><h1>${accent}</h1><p>INFO75 | Tecnologia, redes e fibra óptica</p></div></div><div class="hero-note"><strong>Documento</strong><span>${title}</span><p>Emitido em ${new Date().toLocaleDateString("pt-BR")}</p></div></header><main class="content"><div class="content-top"><div class="doc-chip">INFO75 Documento Oficial</div><div class="doc-title">${title}</div></div>${body}</main><footer class="footer"><span><strong>INFO75</strong> | Documento gerado pela central operacional.</span><span>Aberto para visualização e impressão.</span></footer></article>`;
  const key = `print-doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(key, documentMarkup);
  const tab = window.open(`/print.html?key=${encodeURIComponent(key)}`, "_blank");
  if (!tab) {
    window.location.assign(`/print.html?key=${encodeURIComponent(key)}`);
  }
}

function openBudgetPdf(id) {
  const item = find("orcamentos", id);
  if (!item) return;
  printDoc(`Orçamento ${esc(item.numero)}`, `<div class="accent-rule"></div><div class="meta-grid"><div class="box"><h2>Cliente</h2><p><strong>${esc(item.cliente)}</strong></p><p>Telefone: ${esc(item.telefone || "-")}</p><p>Endereço: ${esc(item.endereco || "-")}</p></div><div class="box"><h2>Dados do orçamento</h2><p>Número: ${esc(item.numero || "-")}</p><p>Data: ${dateBr(item.data)}</p><p>Validade: ${dateBr(item.validade || "")}</p><p>Status: ${esc(normalizeStatus(item.status))}</p></div></div><div class="section"><h2>Observações</h2><p>${esc(item.comentarios || "Sem observações adicionais.")}</p></div><div class="table-card"><table><thead><tr><th>Descrição / Material</th><th>Unidade</th><th>Qtd</th><th>Valor</th><th>Total</th></tr></thead><tbody>${item.itens.map((entry) => `<tr><td>${esc(entry.descricao)}</td><td>${esc(entry.unidade)}</td><td>${entry.quantidade}</td><td>${money(entry.valorUnitario)}</td><td>${money(entry.quantidade * entry.valorUnitario)}</td></tr>`).join("")}</tbody></table></div><div class="split-note"><div class="mini-panel"><h3>Condições</h3><p>Proposta emitida pela INFO75 com base nos itens e valores descritos. Alterações de escopo, prazo ou disponibilidade podem gerar revisão comercial.</p></div><div class="total-card"><span>Total do orçamento</span><strong>${money(item.total)}</strong></div></div>`, "ORÇAMENTO");
}

function openServiceOrderPdf(id) {
  const item = find("servicos", id);
  if (!item) return;
  const cliente = state.db.clientes.find((entry) => entry.id === item.clienteId || entry.nome === item.cliente);
  printDoc("Ordem de Serviço", `<div class="accent-rule"></div><div class="meta-grid"><div class="box"><h2>Cliente</h2><p><strong>${esc(item.cliente)}</strong></p><p>Telefone: ${esc(cliente?.telefone || "-")}</p><p>Data de abertura: ${dateBr(item.createdAt?.slice(0, 10))}</p></div><div class="box"><h2>Serviço</h2><p>Tipo: ${esc(item.tipo)}</p><p>Status: ${esc(normalizeStatus(item.status))}</p><p>Atendimento: INFO75 assistência técnica</p></div></div><div class="section"><h2>Observações</h2><p>${esc(item.observacoes || "Sem observações registradas.")}</p></div><div class="split-note"><div class="mini-panel"><h3>Registro técnico</h3><p>Documento emitido para acompanhamento do atendimento, rastreio do status atual e formalização da atividade realizada pela equipe INFO75.</p></div><div class="total-card"><span>Status atual</span><strong>${esc(normalizeStatus(item.status))}</strong></div></div>`, "ORDEM DE SERVIÇO");
}
async function createRecord(collection, payload, message) {
  await api(`/api/${collection}`, { method: "POST", body: JSON.stringify(payload) });
  await refreshState();
  toast(message);
}

async function updateRecord(collection, id, payload, message) {
  await api(`/api/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  await refreshState();
  toast(message);
}

async function deleteRecord(collection, id, message) {
  await api(`/api/${collection}/${id}`, { method: "DELETE", headers: {} });
  await refreshState();
  toast(message);
}

function editCliente(id) {
  const item = find("clientes", id);
  if (!item) return;
  modal({
    title: "Editar cliente",
    values: item,
    fields: [
      { name: "nome", label: "Nome da empresa", required: true },
      { name: "responsavel", label: "Responsável" },
      { name: "email", label: "Email", type: "email" },
      { name: "telefone", label: "Telefone" },
      { name: "endereco", label: "Endereço", full: true },
    ],
    onSubmit: async (data) => {
      await updateRecord("clientes", id, data, "Cliente atualizado.");
    },
  });
}

function editServico(id) {
  const item = find("servicos", id);
  if (!item) return;
  modal({
    title: "Editar serviço",
    values: item,
    fields: [
      { name: "tipo", label: "Tipo de serviço", required: true },
      { name: "status", label: "Status", type: "select", options: ["Pendente", "Em Andamento", "Concluído"], required: true },
      { name: "observacoes", label: "Observações", type: "textarea", full: true },
    ],
    onSubmit: async (data) => {
      await updateRecord("servicos", id, data, "Serviço atualizado.");
    },
  });
}

function editVisita(id) {
  const item = find("visitas", id);
  if (!item) return;
  modal({
    title: "Editar visita",
    values: item,
    fields: [
      { name: "servico", label: "Tipo de serviço", required: true },
      { name: "data", label: "Data da visita", type: "date", required: true },
      { name: "observacoes", label: "Observações", type: "textarea", full: true },
    ],
    onSubmit: async (data) => {
      await updateRecord("visitas", id, data, "Visita atualizada.");
    },
  });
}

function editFinanceiro(id) {
  const item = find("financeiro", id);
  if (!item) return;
  modal({
    title: "Editar lançamento financeiro",
    values: item,
    fields: [
      { name: "descricao", label: "Descrição", required: true, full: true },
      { name: "tipo", label: "Tipo", type: "select", options: ["Receita", "Despesa"], required: true },
      { name: "valor", label: "Valor", type: "number", required: true },
      { name: "status", label: "Status", type: "select", options: ["Pendente", "Pago", "Cancelado"], required: true },
      { name: "categoria", label: "Categoria" },
      { name: "cliente", label: "Cliente" },
      { name: "data", label: "Data", type: "date", required: true },
    ],
    onSubmit: async (data) => {
      await updateRecord("financeiro", id, { ...data, valor: Number(data.valor || 0) }, "Lançamento atualizado.");
    },
  });
}

function editEstoque(id) {
  const item = find("estoque", id);
  if (!item) return;
  modal({
    title: "Editar item de estoque",
    values: item,
    fields: [
      { name: "nome", label: "Nome do item", required: true, full: true },
      { name: "categoria", label: "Categoria" },
      { name: "fornecedor", label: "Fornecedor" },
      { name: "quantidade", label: "Quantidade", type: "number", required: true },
      { name: "minimo", label: "Quantidade mínima", type: "number", required: true },
      { name: "valor", label: "Valor unitário", type: "number", required: true },
    ],
    onSubmit: async (data) => {
      await updateRecord("estoque", id, { ...data, quantidade: Number(data.quantidade || 0), minimo: Number(data.minimo || 0), valor: Number(data.valor || 0) }, "Item de estoque atualizado.");
    },
  });
}

function editUser(id) {
  const user = find("users", id);
  if (!user) return;
  setTab("usuarios");
  refs.userForm.querySelector("[name='nome']").value = user.nome;
  refs.userForm.querySelector("[name='username']").value = user.username;
  refs.userForm.querySelector("[name='password']").value = "";
  refs.userForm.querySelector("[name='role']").value = user.role;
  modules.forEach((moduleName) => {
    const current = user.permissions?.[moduleName] || { view: false, edit: false };
    const viewInput = refs.userForm.querySelector(`[name="perm_${moduleName}_view"]`);
    const editInput = refs.userForm.querySelector(`[name="perm_${moduleName}_edit"]`);
    if (viewInput) viewInput.checked = current.view;
    if (editInput) editInput.checked = current.edit;
  });
  refs.userForm.dataset.editingId = id;
  applyPermissionDependencies(refs.userForm);
  toast("Usuário carregado para edição.");
}

refs.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: refs.loginUser.value.trim().toLowerCase(),
        password: refs.loginPassword.value,
      }),
    });
    state.session = payload.user;
    refs.loginForm.reset();
    await refreshState();
    toast("Login realizado com sucesso.");
  } catch (error) {
    toast(error.message || "Falha no login.");
  }
});

refs.logoutButton.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST", headers: {} });
  } catch {}
  state.session = null;
  renderSession();
  toast("Sessão encerrada.");
});

refs.navItems.forEach((item) => item.addEventListener("click", () => setTab(item.dataset.tab)));
refs.mobileMenuToggle?.addEventListener("click", () => setMobileNav(true));
refs.mobileMenuClose?.addEventListener("click", () => setMobileNav(false));
refs.fabMenu?.addEventListener("click", () => setMobileNav(true));
refs.fabLogout?.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST", headers: {} });
  } catch {}
  state.session = null;
  renderSession();
  toast("Sessão encerrada.");
});
refs.visitaServicoTrigger?.addEventListener("click", () => setVisitServiceMenu(!refs.visitaServicoSelect?.classList.contains("open")));
refs.visitaServicoChecklist?.addEventListener("change", () => renderVisitServiceSelection());
refs.visitaFotoButton?.addEventListener("click", () => {
  refs.visitaFotoInput?.click();
});
refs.visitaCameraButton?.addEventListener("click", () => {
  refs.visitaCameraInput?.click();
});
refs.visitaFotoInput?.addEventListener("change", async (event) => {
  await handleVisitPhotoSelection(event.target.files || []);
});
refs.visitaCameraInput?.addEventListener("change", async (event) => {
  await handleVisitPhotoSelection(event.target.files || []);
});
refs.visitaPhotoPreview?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-visit-photo]");
  if (!button) return;
  state.visitPhotoDrafts.splice(Number(button.dataset.removeVisitPhoto), 1);
  renderVisitPhotoPreview();
});
document.addEventListener("click", (event) => {
  if (!refs.visitaServicoSelect?.contains(event.target)) setVisitServiceMenu(false);
});
refs.orcamentoShortcutButtons.forEach((button) => button.addEventListener("click", () => {
  document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
}));
refs.modalCloseButton.addEventListener("click", closeModal);
refs.modalCancelButton.addEventListener("click", closeModal);
refs.recordModal.addEventListener("click", (event) => {
  if (event.target === refs.recordModal) closeModal();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) setMobileNav(false);
});

refs.modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.modalState?.onSubmit) return;
  try {
    await state.modalState.onSubmit(Object.fromEntries(new FormData(event.currentTarget).entries()));
    closeModal();
  } catch (error) {
    toast(error.message || "Falha ao salvar alterações.");
  }
});

refs.clienteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createRecord("clientes", Object.fromEntries(new FormData(event.currentTarget).entries()), "Cliente cadastrado.");
    event.currentTarget.reset();
  } catch (error) {
    toast(error.message || "Falha ao cadastrar cliente.");
  }
});

refs.servicoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (!data.cliente) return toast("Selecione um cliente.");
  try {
    await createRecord("servicos", { clienteId: data.cliente, tipo: data.tipo, status: data.status, observacoes: data.observacoes }, "Serviço registrado.");
    event.currentTarget.reset();
    refs.servicoCliente.value = "";
  } catch (error) {
    toast(error.message || "Falha ao registrar serviço.");
  }
});

refs.visitaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const servicosSelecionados = getSelectedVisitServices();
  if (!data.cliente) return toast("Selecione um cliente.");
  if (!servicosSelecionados.length) return toast("Selecione pelo menos um tipo de serviço.");
  try {
    await createRecord("visitas", { clienteId: data.cliente, servico: servicosSelecionados.join(", "), data: data.data, observacoes: data.observacoes, fotos: state.visitPhotoDrafts.map((photo) => ({ id: photo.id, dataUrl: photo.dataUrl })) }, "Visita registrada.");
    event.currentTarget.reset();
    refs.visitaForm.querySelector("[name='data']").value = todayIso;
    refs.visitaCliente.value = "";
    renderVisitServiceSelection();
    setVisitServiceMenu(false);
    resetVisitPhotoDrafts();
  } catch (error) {
    toast(error.message || "Falha ao registrar visita.");
  }
});

refs.financeiroForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  try {
    await createRecord("financeiro", { ...data, valor: Number(data.valor || 0) }, "Lançamento salvo.");
    event.currentTarget.reset();
    refs.financeiroForm.querySelector("[name='data']").value = todayIso;
    refs.financeiroForm.querySelector("[name='valor']").value = 0;
  } catch (error) {
    toast(error.message || "Falha ao salvar lançamento.");
  }
});

refs.estoqueForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  try {
    await createRecord("estoque", { ...data, quantidade: Number(data.quantidade || 0), minimo: Number(data.minimo || 0), valor: Number(data.valor || 0) }, "Item salvo no estoque.");
    event.currentTarget.reset();
    refs.estoqueForm.querySelector("[name='quantidade']").value = 0;
    refs.estoqueForm.querySelector("[name='minimo']").value = 1;
    refs.estoqueForm.querySelector("[name='valor']").value = 0;
  } catch (error) {
    toast(error.message || "Falha ao salvar item de estoque.");
  }
});

refs.userForm?.addEventListener("change", (event) => {
  if (event.target.name === "role" && event.target.value === "admin") {
    modules.forEach((moduleName) => {
      const viewInput = refs.userForm.querySelector(`[name="perm_${moduleName}_view"]`);
      const editInput = refs.userForm.querySelector(`[name="perm_${moduleName}_edit"]`);
      if (viewInput) viewInput.checked = true;
      if (editInput) editInput.checked = true;
    });
  } else if (event.target.name === "role" && event.target.value === "tecnico") {
    const userView = refs.userForm.querySelector('[name="perm_usuarios_view"]');
    const userEdit = refs.userForm.querySelector('[name="perm_usuarios_edit"]');
    if (userView) userView.checked = false;
    if (userEdit) userEdit.checked = false;
  }
  applyPermissionDependencies(refs.userForm);
});

refs.userForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const payload = {
    nome: data.nome,
    username: data.username,
    password: data.password,
    role: data.role,
    permissions: readPermissionsFromForm(event.currentTarget),
  };
  try {
    const editingId = event.currentTarget.dataset.editingId;
    if (editingId) {
        await updateRecord("users", editingId, payload, "Usuário atualizado.");
      delete event.currentTarget.dataset.editingId;
    } else {
        await createRecord("users", payload, "Usuário criado.");
    }
    event.currentTarget.reset();
    applyPermissionDependencies(event.currentTarget);
  } catch (error) {
    toast(error.message || "Falha ao salvar usuário.");
  }
});

refs.exportBackupButton?.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/admin/backup", { method: "GET", credentials: "same-origin" });
    if (!response.ok) throw new Error("Falha ao exportar backup.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-site-servicos-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    await refreshState();
    toast("Backup exportado.");
  } catch (error) {
    toast(error.message || "Falha ao exportar backup.");
  }
});

refs.importBackupInput?.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  try {
    const text = await file.text();
    await api("/api/admin/restore", { method: "POST", body: text, headers: { "Content-Type": "application/json" } });
    await refreshState();
    toast("Backup restaurado com sucesso.");
  } catch (error) {
    toast(error.message || "Falha ao restaurar backup.");
  } finally {
    event.target.value = "";
  }
});

refs.adminPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  try {
    await api("/api/admin/change-password", { method: "POST", body: JSON.stringify(data) });
    event.currentTarget.reset();
    await refreshState();
    toast("Senha admin atualizada.");
  } catch (error) {
    toast(error.message || "Falha ao alterar senha admin.");
  }
});

refs.themeToggle?.addEventListener("change", (event) => {
  setTheme(event.target.checked ? "dark" : "light");
});

refs.orcamentoCliente.addEventListener("change", () => {
  const cliente = state.db.clientes.find((item) => item.id === refs.orcamentoCliente.value);
  refs.orcamentoForm.querySelector("[name='endereco']").value = cliente?.endereco || "";
  refs.orcamentoForm.querySelector("[name='telefone']").value = cliente?.telefone || "";
});

refs.addQuoteItem.addEventListener("click", () => {
  state.quoteDraftItems.push(draftItem());
  renderQuoteDraft();
});

refs.quoteItemsBody.addEventListener("change", (event) => {
  const row = event.target.closest("tr");
  const item = state.quoteDraftItems.find((entry) => entry.id === row?.dataset.itemId);
  if (!item || !event.target.dataset.field) return;
  item[event.target.dataset.field] = ["quantidade", "valorUnitario"].includes(event.target.dataset.field) ? Number(event.target.value || 0) : event.target.value;
  renderQuoteDraft();
});

refs.quoteItemsBody.addEventListener("click", (event) => {
  if (!event.target.classList.contains("quote-remove")) return;
  state.quoteDraftItems = state.quoteDraftItems.filter((item) => item.id !== event.target.closest("tr").dataset.itemId);
  if (!state.quoteDraftItems.length) state.quoteDraftItems = [draftItem()];
  renderQuoteDraft();
});

refs.orcamentoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (!data.clienteId) return toast("Selecione um cliente para o orçamento.");
  const itens = state.quoteDraftItems.filter((item) => item.descricao.trim());
  if (!itens.length) return toast("Adicione pelo menos um item válido ao orçamento.");

  const subtotal = itens.reduce((sum, item) => sum + item.quantidade * item.valorUnitario, 0);
  const payload = { ...data, itens: itens.map((item) => ({ ...item })), subtotal, total: subtotal };

  try {
    const editingId = refs.orcamentoForm.dataset.editingId;
    if (editingId) await updateRecord("orcamentos", editingId, payload, "Orçamento atualizado.");
    else await createRecord("orcamentos", payload, "Orçamento salvo.");
    resetQuoteForm();
  } catch (error) {
    toast(error.message || "Falha ao salvar orçamento.");
  }
});

refs.servicosList.addEventListener("change", async (event) => {
  if (!event.target.classList.contains("service-status-select")) return;
  const item = find("servicos", event.target.dataset.serviceId);
  if (!item) return;
  try {
    await updateRecord("servicos", item.id, { tipo: item.tipo, status: event.target.value, observacoes: item.observacoes }, "Status do serviço atualizado.");
  } catch (error) {
    toast(error.message || "Falha ao atualizar status.");
  }
});

refs.servicoFilters.forEach((button) => button.addEventListener("click", () => {
  state.serviceFilter = button.dataset.filter;
  refs.servicoFilters.forEach((item) => item.classList.toggle("active", item === button));
  renderServicos();
}));

refs.orcamentoFilters.forEach((button) => button.addEventListener("click", () => {
  state.budgetFilter = button.dataset.filter;
  refs.orcamentoFilters.forEach((item) => item.classList.toggle("active", item === button));
  renderOrcamentos();
}));

refs.financeiroFilters.forEach((button) => button.addEventListener("click", () => {
  state.financeFilter = button.dataset.filter;
  refs.financeiroFilters.forEach((item) => item.classList.toggle("active", item === button));
  renderFinanceiro();
}));

refs.clienteSearch?.addEventListener("input", (event) => {
  state.clienteSearch = event.target.value;
  renderClientes();
});

refs.servicoSearch?.addEventListener("input", (event) => {
  state.servicoSearch = event.target.value;
  renderServicos();
});

refs.userSearch?.addEventListener("input", (event) => {
  state.userSearch = event.target.value;
  renderUsers();
  applyAccessControl();
});

refs.auditPeriod?.addEventListener("change", (event) => {
  state.auditPeriod = event.target.value || "monthly";
  renderAudit();
});

refs.auditPdfButton?.addEventListener("click", () => {
  openAuditPdfReport();
});

refs.clientesList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-cliente") return editCliente(button.dataset.id);
  if (button.dataset.action === "delete-cliente" && window.confirm("Excluir este cliente?")) {
    try {
      await deleteRecord("clientes", button.dataset.id, "Cliente excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir cliente.");
    }
  }
});

refs.servicosList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-servico") return editServico(button.dataset.id);
  if (button.dataset.action === "pdf-os") return openServiceOrderPdf(button.dataset.id);
  if (button.dataset.action === "delete-servico" && window.confirm("Excluir este serviço?")) {
    try {
      await deleteRecord("servicos", button.dataset.id, "Serviço excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir serviço.");
    }
  }
});

refs.visitasList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-visita") return editVisita(button.dataset.id);
  if (button.dataset.action === "delete-visita" && window.confirm("Excluir esta visita?")) {
    try {
      await deleteRecord("visitas", button.dataset.id, "Visita excluída.");
    } catch (error) {
      toast(error.message || "Falha ao excluir visita.");
    }
  }
});

refs.orcamentosList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-orcamento") {
    loadBudgetIntoForm(button.dataset.id);
    toast("Orçamento carregado para edição.");
    return;
  }
  if (button.dataset.action === "pdf-orcamento") return openBudgetPdf(button.dataset.id);
  if (button.dataset.action === "delete-orcamento" && window.confirm("Excluir este orçamento?")) {
    try {
      await deleteRecord("orcamentos", button.dataset.id, "Orçamento excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir orçamento.");
    }
  }
});

refs.financeiroList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-financeiro") return editFinanceiro(button.dataset.id);
  if (button.dataset.action === "delete-financeiro" && window.confirm("Excluir este lançamento?")) {
    try {
      await deleteRecord("financeiro", button.dataset.id, "Lançamento excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir lançamento.");
    }
  }
});

refs.estoqueList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-estoque") return editEstoque(button.dataset.id);
  if (button.dataset.action === "delete-estoque" && window.confirm("Excluir este item?")) {
    try {
      await deleteRecord("estoque", button.dataset.id, "Item excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir item.");
    }
  }
});

refs.usersList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-user") return editUser(button.dataset.id);
  if (button.dataset.action === "delete-user" && window.confirm("Excluir este usuário?")) {
    try {
      await deleteRecord("users", button.dataset.id, "Usuário excluído.");
    } catch (error) {
      toast(error.message || "Falha ao excluir usuário.");
    }
  }
});

async function bootstrap() {
  setTheme(state.theme);
  refs.visitaForm.querySelector("[name='data']").value = todayIso;
  refs.financeiroForm.querySelector("[name='data']").value = todayIso;
  resetQuoteForm();
  applyPermissionDependencies(refs.userForm);
  renderVisitServiceSelection();
  setVisitServiceMenu(false);
  resetVisitPhotoDrafts();
  try {
    await refreshState();
  } catch {
    toast("Não foi possível carregar o sistema. Inicie o servidor Node.");
  }
}

bootstrap();



