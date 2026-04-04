const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const {
  IS_PRODUCTION,
  HOST,
  PORT,
  APP_ROOT,
  APP_BASE_URL,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  BODY_LIMIT_BYTES,
  BACKUP_DIR,
  MIME_TYPES,
} = require("./services/config");
const { sessionCookieHeader, baseSecurityHeaders } = require("./services/security");
const {
  normalizeText,
  normalizeUsername,
  createPasswordHash,
  verifyPassword,
  randomToken,
} = require("./services/auth");
const {
  MODULE_KEYS,
  nowIso,
  randomId,
  fullPermissions,
  sanitizePermissions,
  ensureDataDir,
  loadDb,
  saveDb,
} = require("./services/data-store");
const { audit, readAudit } = require("./services/audit");

const sessions = new Map();
const COLLECTION_TO_MODULE = {
  clientes: "clientes",
  servicos: "servicos",
  visitas: "visitas",
  orcamentos: "orcamento",
  financeiro: "financeiro",
  estoque: "estoque",
  users: "usuarios",
};

function normalizeMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function canAccess(user, moduleName, level = "view") {
  if (!user) return false;
  if (user.role === "admin") return true;
  return Boolean(user.permissions?.[moduleName]?.[level]);
}

function sanitizeBudgetItems(items) {
  return Array.isArray(items)
    ? items
      .map((item) => ({
        id: normalizeText(item.id) || randomId(),
        descricao: normalizeText(item.descricao),
        unidade: normalizeText(item.unidade) || "un",
        quantidade: Math.max(1, Number(item.quantidade || 1)),
        valorUnitario: Math.max(0, normalizeMoney(item.valorUnitario)),
      }))
      .filter((item) => item.descricao)
    : [];
}

let db;
try {
  db = loadDb();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    username: user.username,
    role: user.role,
    permissions: sanitizePermissions(user.permissions, user.role),
  };
}

function getClientById(clientId) {
  return db.clientes.find((item) => item.id === clientId);
}

function syncClientRefs(clientId, client) {
  db.servicos.forEach((item) => {
    if (item.clienteId === clientId) item.cliente = client.nome;
  });
  db.visitas.forEach((item) => {
    if (item.clienteId === clientId) item.cliente = client.nome;
  });
  db.orcamentos.forEach((item) => {
    if (item.clienteId === clientId) {
      item.cliente = client.nome;
      item.endereco = client.endereco;
      item.telefone = client.telefone;
    }
  });
}

function removeExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
}

function parseCookies(request) {
  const header = request.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
    const eq = part.indexOf("=");
    const key = eq === -1 ? part : part.slice(0, eq);
    const value = eq === -1 ? "" : part.slice(eq + 1);
    return [key, decodeURIComponent(value)];
  }));
}

function getSession(request) {
  removeExpiredSessions();
  const token = parseCookies(request)[SESSION_COOKIE_NAME];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return session;
}

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...baseSecurityHeaders(),
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...baseSecurityHeaders(),
    ...headers,
  });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > BODY_LIMIT_BYTES) {
        reject(new Error("Payload excede o limite."));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    request.on("error", reject);
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function notFound(response) {
  sendJson(response, 404, { error: "Recurso nao encontrado." });
}

function requireAuth(request, response) {
  const session = getSession(request);
  if (!session) {
    sendJson(response, 401, { error: "SessÃ£o invÃ¡lida ou expirada." });
    return null;
  }
  return session;
}

function requirePermission(session, response, moduleName, level = "view") {
  if (!canAccess(session.user, moduleName, level)) {
    sendJson(response, 403, { error: "Voce nao possui permissao para esta area." });
    return false;
  }
  return true;
}

function requireAdmin(session, response) {
  if (session.user.role !== "admin") {
    sendJson(response, 403, { error: "Acesso permitido apenas para administrador." });
    return false;
  }
  return true;
}

function publicDbView(user) {
  const canUseClientRefs = canAccess(user, "clientes", "view") || canAccess(user, "servicos", "view") || canAccess(user, "visitas", "view") || canAccess(user, "orcamento", "view");
  return {
    clientes: canUseClientRefs ? [...db.clientes] : [],
    servicos: canAccess(user, "servicos", "view") ? [...db.servicos] : [],
    visitas: canAccess(user, "visitas", "view") ? [...db.visitas] : [],
    orcamentos: canAccess(user, "orcamento", "view") ? [...db.orcamentos] : [],
    financeiro: canAccess(user, "financeiro", "view") ? [...db.financeiro] : [],
    estoque: canAccess(user, "estoque", "view") ? [...db.estoque] : [],
    users: user.role === "admin" ? db.users.map((item) => sanitizeUser(item)) : [],
  };
}

function validateClient(payload) {
  const nome = normalizeText(payload.nome);
  if (!nome) throw new Error("Nome da empresa e obrigatorio.");

  return {
    nome,
    responsavel: normalizeText(payload.responsavel),
    email: normalizeText(payload.email),
    telefone: normalizeText(payload.telefone),
    endereco: normalizeText(payload.endereco),
  };
}

function validateService(payload, current) {
  const clienteId = normalizeText(payload.clienteId || current?.clienteId);
  const cliente = getClientById(clienteId);
  if (!cliente) throw new Error("Cliente do servico nao encontrado.");

  const tipo = normalizeText(payload.tipo);
  if (!tipo) throw new Error("Tipo de servico e obrigatorio.");

  const status = normalizeText(payload.status) || "Pendente";
  if (!["Pendente", "Em Andamento", "ConcluÃ­do"].includes(status)) throw new Error("Status de serviÃ§o invÃ¡lido.");

  return {
    clienteId,
    cliente: cliente.nome,
    tipo,
    status,
    observacoes: normalizeText(payload.observacoes),
  };
}

function validateVisit(payload, current) {
  const clienteId = normalizeText(payload.clienteId || current?.clienteId);
  const cliente = getClientById(clienteId);
  if (!cliente) throw new Error("Cliente da visita nao encontrado.");

  const servico = normalizeText(payload.servico);
  const data = normalizeText(payload.data);
  if (!servico) throw new Error("Tipo de servico da visita e obrigatorio.");
  if (!data) throw new Error("Data da visita e obrigatoria.");

  const fotos = Array.isArray(payload.fotos)
    ? payload.fotos
      .map((foto) => ({
        id: normalizeText(foto?.id) || randomId(),
        dataUrl: normalizeText(foto?.dataUrl),
      }))
      .filter((foto) => /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(foto.dataUrl) && foto.dataUrl.length <= 900_000)
      .slice(0, 4)
    : Array.isArray(current?.fotos) ? current.fotos : [];

  return {
    clienteId,
    cliente: cliente.nome,
    servico,
    data,
    observacoes: normalizeText(payload.observacoes),
    fotos,
  };
}

function validateBudget(payload) {
  const clienteId = normalizeText(payload.clienteId);
  const cliente = getClientById(clienteId);
  if (!cliente) throw new Error("Cliente do orcamento nao encontrado.");

  const itens = sanitizeBudgetItems(payload.itens);
  if (!itens.length) throw new Error("Adicione pelo menos um item ao orcamento.");

  const subtotal = itens.reduce((sum, item) => sum + item.quantidade * item.valorUnitario, 0);
  const status = normalizeText(payload.status) || "Pendente";
  if (!["Pendente", "Aprovado", "Rejeitado", "ConcluÃ­do"].includes(status)) throw new Error("Status de orÃ§amento invÃ¡lido.");

  return {
    clienteId,
    cliente: cliente.nome,
    endereco: normalizeText(payload.endereco) || cliente.endereco,
    telefone: normalizeText(payload.telefone) || cliente.telefone,
    numero: normalizeText(payload.numero) || String(db.orcamentos.reduce((max, item) => Math.max(max, Number(item.numero || 0)), 0) + 1),
    status,
    data: normalizeText(payload.data),
    validade: normalizeText(payload.validade),
    preparadoPor: normalizeText(payload.preparadoPor),
    tecnico: normalizeText(payload.tecnico),
    ocNumero: normalizeText(payload.ocNumero),
    resumo: normalizeText(payload.resumo),
    termos: normalizeText(payload.termos),
    comentarios: normalizeText(payload.comentarios),
    itens,
    subtotal,
    total: subtotal,
  };
}

function validateFinance(payload) {
  const descricao = normalizeText(payload.descricao);
  if (!descricao) throw new Error("DescriÃ§Ã£o Ã© obrigatÃ³ria.");

  const tipo = normalizeText(payload.tipo);
  if (!["Receita", "Despesa"].includes(tipo)) throw new Error("Tipo financeiro invalido.");

  const status = normalizeText(payload.status) || "Pendente";
  if (!["Pendente", "Pago", "Cancelado"].includes(status)) throw new Error("Status financeiro invalido.");

  return {
    descricao,
    tipo,
    valor: Math.max(0, normalizeMoney(payload.valor)),
    data: normalizeText(payload.data),
    categoria: normalizeText(payload.categoria),
    cliente: normalizeText(payload.cliente),
    status,
  };
}

function validateStock(payload) {
  const nome = normalizeText(payload.nome);
  if (!nome) throw new Error("Nome do item e obrigatorio.");

  return {
    nome,
    categoria: normalizeText(payload.categoria),
    fornecedor: normalizeText(payload.fornecedor),
    quantidade: Math.max(0, Number(payload.quantidade || 0)),
    minimo: Math.max(0, Number(payload.minimo || 0)),
    valor: Math.max(0, normalizeMoney(payload.valor)),
  };
}

function validateUser(payload, currentUser) {
  const nome = normalizeText(payload.nome);
  const username = normalizeText(payload.username).toLowerCase();
  const role = normalizeText(payload.role) || "tecnico";
  const password = String(payload.password || "");
  if (!nome) throw new Error("Nome do usuario e obrigatorio.");
  if (!username) throw new Error("Login do usuario e obrigatorio.");
  if (!["admin", "tecnico"].includes(role)) throw new Error("Perfil de usuario invalido.");

  const duplicated = db.users.find((item) => item.username === username && item.id !== currentUser?.id);
  if (duplicated) throw new Error("Ja existe um usuario com este login.");

  const permissions = sanitizePermissions(payload.permissions, role);
  if (role !== "admin" && !Object.values(permissions).some((entry) => entry.view || entry.edit)) {
    throw new Error("Selecione pelo menos uma permissao para o tecnico.");
  }

  const nextUser = {
    nome,
    username,
    role,
    permissions,
  };

  if (password) {
    const { hash, salt } = createPasswordHash(password);
    nextUser.passwordHash = hash;
    nextUser.passwordSalt = salt;
  } else if (!currentUser) {
    throw new Error("Senha inicial e obrigatoria.");
  }

  return nextUser;
}

function countAdmins(exceptId = "") {
  return db.users.filter((item) => item.role === "admin" && item.id !== exceptId).length;
}

function updateCollection(collectionName, id, values) {
  const index = db[collectionName].findIndex((item) => item.id === id);
  if (index === -1) return null;
  const before = clone(db[collectionName][index]);
  db[collectionName][index] = {
    ...db[collectionName][index],
    ...values,
    updatedAt: nowIso(),
  };
  saveDb(db);
  return { before, after: clone(db[collectionName][index]) };
}

function createCollectionItem(collectionName, values) {
  const item = { id: randomId(), ...values, createdAt: nowIso() };
  db[collectionName].unshift(item);
  saveDb(db);
  return { after: clone(item) };
}

function deleteCollectionItem(collectionName, id) {
  const index = db[collectionName].findIndex((item) => item.id === id);
  if (index === -1) return null;
  const before = clone(db[collectionName][index]);
  db[collectionName].splice(index, 1);
  saveDb(db);
  return { before };
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/auth/session" && request.method === "GET") {
    const session = getSession(request);
    sendJson(response, 200, { user: session ? sanitizeUser(session.user) : null });
    return;
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    try {
      const payload = await readBody(request);
      const username = normalizeUsername(payload.username);
      const password = String(payload.password || "");
      const user = db.users.find((item) => item.username === username);
      if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
        audit({ action: "auth_login_failed", username, ip: request.socket.remoteAddress || "" });
        sendJson(response, 401, { error: "Usuario ou senha invalidos." });
        return;
      }

      const token = randomToken();
      sessions.set(token, {
        user: sanitizeUser(user),
        expiresAt: Date.now() + SESSION_TTL_MS,
      });
      audit({ action: "auth_login_success", actorId: user.id, actor: user.username, role: user.role, ip: request.socket.remoteAddress || "" });

      sendJson(response, 200, { user: sanitizeUser(user) }, {
        "Set-Cookie": sessionCookieHeader(token, SESSION_TTL_MS / 1000, request, { cookieName: SESSION_COOKIE_NAME, appBaseUrl: APP_BASE_URL }),
      });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/auth/logout" && request.method === "POST") {
    const token = parseCookies(request)[SESSION_COOKIE_NAME];
    const currentSession = getSession(request);
    if (currentSession) audit({ action: "auth_logout", actorId: currentSession.user.id, actor: currentSession.user.username, role: currentSession.user.role });
    if (token) sessions.delete(token);
    sendJson(response, 200, { ok: true }, {
      "Set-Cookie": sessionCookieHeader("", 0, request, { cookieName: SESSION_COOKIE_NAME, appBaseUrl: APP_BASE_URL }),
    });
    return;
  }

  const session = requireAuth(request, response);
  if (!session) return;

  if (pathname === "/api/bootstrap" && request.method === "GET") {
    sendJson(response, 200, {
      session: session.user,
      data: publicDbView(session.user),
    });
    return;
  }

  if (pathname === "/api/admin/audit" && request.method === "GET") {
    if (!requireAdmin(session, response)) return;
    sendJson(response, 200, { items: readAudit(120) });
    return;
  }

  if (pathname === "/api/admin/backup" && request.method === "GET") {
    if (!requireAdmin(session, response)) return;
    ensureDataDir();
    const stamp = nowIso().replace(/[:.]/g, "-");
    const filename = `backup-${stamp}.json`;
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), "utf8");
    audit({ action: "backup_export", actorId: session.user.id, actor: session.user.username, file: filename });
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    });
    response.end(JSON.stringify(db, null, 2));
    return;
  }

  if (pathname === "/api/admin/restore" && request.method === "POST") {
    if (!requireAdmin(session, response)) return;
    try {
      const payload = normalizeDb(await readBody(request));
      const currentAdmin = db.users.find((item) => item.id === session.user.id);
      const incomingAdmin = payload.users.find((item) => item.id === session.user.id);
      if (!incomingAdmin) {
        sendJson(response, 400, { error: "O backup precisa conter o administrador atual para evitar perda de acesso." });
        return;
      }
      if (!Array.isArray(payload.users) || !payload.users.some((item) => item.role === "admin")) {
        sendJson(response, 400, { error: "O backup restaurado precisa conter pelo menos um administrador." });
        return;
      }
      db = payload;
      saveDb(db);
      sessions.set(parseCookies(request)[SESSION_COOKIE_NAME], {
        user: sanitizeUser(db.users.find((item) => item.id === session.user.id) || currentAdmin),
        expiresAt: Date.now() + SESSION_TTL_MS,
      });
      audit({ action: "backup_restore", actorId: session.user.id, actor: session.user.username, snapshotAfter: { meta: db.meta, counts: { users: db.users.length, clientes: db.clientes.length, servicos: db.servicos.length, visitas: db.visitas.length, orcamentos: db.orcamentos.length, financeiro: db.financeiro.length, estoque: db.estoque.length } } });
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/admin/change-password" && request.method === "POST") {
    if (!requireAdmin(session, response)) return;
    try {
      const payload = await readBody(request);
      const currentPassword = String(payload.currentPassword || "");
      const newPassword = String(payload.newPassword || "");
      const user = db.users.find((item) => item.id === session.user.id);
      if (!user || !verifyPassword(currentPassword, user.passwordHash, user.passwordSalt)) {
        sendJson(response, 400, { error: "Senha atual invalida." });
        return;
      }
      if (newPassword.length < 8) {
        sendJson(response, 400, { error: "A nova senha deve ter pelo menos 8 caracteres." });
        return;
      }
      const { hash, salt } = createPasswordHash(newPassword);
      user.passwordHash = hash;
      user.passwordSalt = salt;
      user.updatedAt = nowIso();
      saveDb(db);
      audit({ action: "admin_password_changed", actorId: user.id, actor: user.username });
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/users" && request.method === "POST") {
    if (!requireAdmin(session, response)) return;
    try {
      const result = createCollectionItem("users", validateUser(await readBody(request)));
      audit({ action: "user_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, target: result.after.username, targetRole: result.after.role, snapshotAfter: sanitizeUser(result.after) });
      sendJson(response, 201, { item: sanitizeUser(result.after) });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/clientes" && request.method === "POST") {
    if (!requirePermission(session, response, "clientes", "edit")) return;
    try {
      const payload = validateClient(await readBody(request));
      const result = createCollectionItem("clientes", payload);
      audit({ action: "clientes_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/servicos" && request.method === "POST") {
    if (!requirePermission(session, response, "servicos", "edit")) return;
    try {
      const result = createCollectionItem("servicos", validateService(await readBody(request)));
      audit({ action: "servicos_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, finalizadoPor: session.user.username, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/visitas" && request.method === "POST") {
    if (!requirePermission(session, response, "visitas", "edit")) return;
    try {
      const result = createCollectionItem("visitas", validateVisit(await readBody(request)));
      audit({ action: "visitas_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, finalizadoPor: session.user.username, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/orcamentos" && request.method === "POST") {
    if (!requirePermission(session, response, "orcamento", "edit")) return;
    try {
      const result = createCollectionItem("orcamentos", validateBudget(await readBody(request)));
      audit({ action: "orcamentos_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, finalizadoPor: session.user.username, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/financeiro" && request.method === "POST") {
    if (!requirePermission(session, response, "financeiro", "edit")) return;
    try {
      const result = createCollectionItem("financeiro", validateFinance(await readBody(request)));
      audit({ action: "financeiro_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/estoque" && request.method === "POST") {
    if (!requirePermission(session, response, "estoque", "edit")) return;
    try {
      const result = createCollectionItem("estoque", validateStock(await readBody(request)));
      audit({ action: "estoque_created", actorId: session.user.id, actor: session.user.username, targetId: result.after.id, snapshotAfter: result.after });
      sendJson(response, 201, { item: result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3 || parts[0] !== "api") {
    notFound(response);
    return;
  }

  const [, collectionName, id] = parts;
  if (!["clientes", "servicos", "visitas", "orcamentos", "financeiro", "estoque", "users"].includes(collectionName)) {
    notFound(response);
    return;
  }

  if (request.method === "PATCH") {
    const moduleName = COLLECTION_TO_MODULE[collectionName];
    if (collectionName === "users") {
      if (!requireAdmin(session, response)) return;
    } else if (!requirePermission(session, response, moduleName, "edit")) return;
    try {
      const current = db[collectionName].find((item) => item.id === id);
      if (!current) {
        notFound(response);
        return;
      }

      let values;
      const payload = await readBody(request);
      if (collectionName === "users") {
        values = validateUser(payload, current);
        if (current.id === session.user.id && values.role !== current.role) {
          throw new Error("Voce nao pode alterar o proprio perfil pelo painel.");
        }
        if (current.role === "admin" && values.role !== "admin" && countAdmins(current.id) === 0) {
          throw new Error("NÃ£o Ã© permitido remover o Ãºltimo administrador.");
        }
      } else if (collectionName === "clientes") values = validateClient(payload);
      else if (collectionName === "servicos") values = validateService(payload, current);
      else if (collectionName === "visitas") values = validateVisit(payload, current);
      else if (collectionName === "orcamentos") values = validateBudget(payload);
      else if (collectionName === "financeiro") values = validateFinance(payload);
      else values = validateStock(payload);

      const result = updateCollection(collectionName, id, values);
      if (collectionName === "clientes") {
        syncClientRefs(id, result.after);
        saveDb(db);
      }
      const afterStatus = result.after?.status ? String(result.after.status).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
      const isFinalizing = ["concluido", "aprovado"].includes(afterStatus);
      const finalizadoPor = isFinalizing ? session.user.username : undefined;
      const auditEntry = { action: `${collectionName}_updated`, actorId: session.user.id, actor: session.user.username, targetId: id, snapshotBefore: collectionName === "users" ? sanitizeUser(result.before) : result.before, snapshotAfter: collectionName === "users" ? sanitizeUser(result.after) : result.after };
      if (finalizadoPor) auditEntry.finalizadoPor = finalizadoPor;
      audit(auditEntry);
      sendJson(response, 200, { item: collectionName === "users" ? sanitizeUser(result.after) : result.after });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (request.method === "DELETE") {
    const moduleName = COLLECTION_TO_MODULE[collectionName];
    if (collectionName === "users") {
      if (!requireAdmin(session, response)) return;
    } else if (!requirePermission(session, response, moduleName, "edit")) return;
    const current = db[collectionName].find((item) => item.id === id);
    if (!current) {
      notFound(response);
      return;
    }

    if (collectionName === "clientes") {
      const serviceLinks = db.servicos.some((item) => item.clienteId === id);
      const visitLinks = db.visitas.some((item) => item.clienteId === id);
      const budgetLinks = db.orcamentos.some((item) => item.clienteId === id);
      if (serviceLinks || visitLinks || budgetLinks) {
        sendJson(response, 409, { error: "Cliente possui vinculos com servicos, visitas ou orcamentos. Remova os vinculos antes de excluir." });
        return;
      }
    }

    if (collectionName === "users") {
      if (current.id === session.user.id) {
        sendJson(response, 409, { error: "Voce nao pode excluir o proprio usuario." });
        return;
      }
      if (current.role === "admin" && countAdmins(current.id) === 0) {
        sendJson(response, 409, { error: "NÃ£o Ã© permitido excluir o Ãºltimo administrador." });
        return;
      }
    }

    const deleted = deleteCollectionItem(collectionName, id);
    if (!deleted) {
      notFound(response);
      return;
    }

    audit({ action: `${collectionName}_deleted`, actorId: session.user.id, actor: session.user.username, targetId: id, snapshotBefore: collectionName === "users" ? sanitizeUser(deleted.before) : deleted.before });
    sendJson(response, 200, { ok: true });
    return;
  }

  notFound(response);
}

function safeFilePath(urlPath) {
  const cleanPath = urlPath === "/" ? "/index.html" : urlPath;
  const resolved = path.normalize(path.join(APP_ROOT, cleanPath));
  if (!resolved.startsWith(APP_ROOT)) return null;
  return resolved;
}

function serveStatic(response, pathname) {
  const filePath = safeFilePath(pathname);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(response, 404, "Arquivo nao encontrado.");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    ...baseSecurityHeaders(),
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url.pathname);
      return;
    }
    serveStatic(response, url.pathname);
  } catch (error) {
    sendJson(response, 500, IS_PRODUCTION ? { error: "Erro interno do servidor." } : { error: "Erro interno do servidor.", detail: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor disponivel em ${APP_BASE_URL}`);
});

