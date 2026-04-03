const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DATA_DIR, DB_PATH, BACKUP_DIR } = require("./config");
const { createPasswordHash, normalizeUsername } = require("./auth");

const MODULE_KEYS = ["servicos", "visitas", "orcamento", "financeiro", "estoque", "relatorio", "clientes", "usuarios"];

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  return crypto.randomUUID();
}

function fullPermissions() {
  return Object.fromEntries(MODULE_KEYS.map((key) => [key, { view: true, edit: true }]));
}

function sanitizePermissions(input, role = "tecnico") {
  if (role === "admin") return fullPermissions();

  return Object.fromEntries(MODULE_KEYS.map((key) => {
    const current = input?.[key];
    return [key, { view: Boolean(current?.view), edit: Boolean(current?.edit) }];
  }));
}

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function buildInitialDb(adminPassword) {
  if (!adminPassword) {
    throw new Error("Banco inexistente. Defina SANAN_ADMIN_PASSWORD antes do primeiro uso para criar o administrador inicial.");
  }

  const { hash, salt } = createPasswordHash(adminPassword);
  const clientA = randomId();
  const clientB = randomId();

  return {
    meta: {
      version: 2,
      createdAt: nowIso(),
      hardenedAt: nowIso(),
    },
    users: [
      {
        id: randomId(),
        nome: "Administrador",
        username: "admin",
        role: "admin",
        permissions: fullPermissions(),
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: nowIso(),
      },
    ],
    clientes: [
      {
        id: clientA,
        nome: "SANAN DIOGO",
        responsavel: "SAN",
        email: "diogosanan@gmail.com",
        telefone: "66996871285",
        endereco: "Rua Cristo Rei",
        createdAt: nowIso(),
      },
      {
        id: clientB,
        nome: "Tech Solutions LTDA",
        responsavel: "Carlos Silva",
        email: "contato@techsolutions.com.br",
        telefone: "(11) 98765-4321",
        endereco: "Rua da Tecnologia, 100 - Sao Paulo/SP",
        createdAt: nowIso(),
      },
    ],
    servicos: [
      {
        id: randomId(),
        clienteId: clientA,
        cliente: "SANAN DIOGO",
        tipo: "Formatacao",
        status: "Concluido",
        observacoes: "Equipamento entregue e validado.",
        createdAt: nowIso(),
      },
      {
        id: randomId(),
        clienteId: clientB,
        cliente: "Tech Solutions LTDA",
        tipo: "Visita tecnica",
        status: "Pendente",
        observacoes: "Ambiente aguardando janela de manutencao.",
        createdAt: nowIso(),
      },
    ],
    visitas: [
      {
        id: randomId(),
        clienteId: clientB,
        cliente: "Tech Solutions LTDA",
        servico: "Manutencao Preventiva",
        data: nowIso().slice(0, 10),
        observacoes: "Verificacao programada da infraestrutura.",
        createdAt: nowIso(),
      },
    ],
    orcamentos: [],
    financeiro: [],
    estoque: [],
  };
}

function normalizeUsers(users = []) {
  return users.map((user) => ({
    ...user,
    username: normalizeUsername(user.username),
    permissions: sanitizePermissions(user.permissions, user.role),
  }));
}

function normalizeDb(raw) {
  const db = raw && typeof raw === "object" ? raw : {};
  const normalized = {
    meta: {
      version: Number(db.meta?.version || 2),
      createdAt: db.meta?.createdAt || nowIso(),
      hardenedAt: db.meta?.hardenedAt || nowIso(),
    },
    users: Array.isArray(db.users) ? normalizeUsers(db.users) : [],
    clientes: Array.isArray(db.clientes) ? db.clientes : [],
    servicos: Array.isArray(db.servicos) ? db.servicos : [],
    visitas: Array.isArray(db.visitas) ? db.visitas : [],
    orcamentos: Array.isArray(db.orcamentos) ? db.orcamentos : [],
    financeiro: Array.isArray(db.financeiro) ? db.financeiro : [],
    estoque: Array.isArray(db.estoque) ? db.estoque : [],
  };

  if (!normalized.users.length) {
    throw new Error("Banco invalido: nenhum usuario encontrado.");
  }

  if (!normalized.users.some((user) => user.role === "admin")) {
    throw new Error("Banco invalido: nenhum administrador encontrado.");
  }

  return normalized;
}

function saveDb(db) {
  ensureDataDir();
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmpPath, DB_PATH);
}

function backupCorruptedDb() {
  const stamp = nowIso().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `corrupted-db-${stamp}.json`);
  fs.copyFileSync(DB_PATH, backupPath);
  return backupPath;
}

function maybeSyncAdminPassword(db) {
  const requestedPassword = String(process.env.SANAN_ADMIN_PASSWORD || "").trim();
  const resetOnStart = String(process.env.SANAN_ADMIN_PASSWORD_RESET_ON_START || "false").toLowerCase() === "true";
  if (!requestedPassword || !resetOnStart) return db;

  const admin = db.users.find((user) => user.role === "admin" && user.username === "admin");
  if (!admin) return db;

  const { hash, salt } = createPasswordHash(requestedPassword);
  admin.passwordHash = hash;
  admin.passwordSalt = salt;
  admin.updatedAt = nowIso();
  db.meta.hardenedAt = nowIso();
  return db;
}

function loadDb() {
  ensureDataDir();

  if (!fs.existsSync(DB_PATH)) {
    const db = buildInitialDb(String(process.env.SANAN_ADMIN_PASSWORD || "").trim());
    saveDb(db);
    return db;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const db = maybeSyncAdminPassword(normalizeDb(raw));
    saveDb(db);
    return db;
  } catch {
    const backupPath = backupCorruptedDb();
    throw new Error(`Falha ao carregar ${DB_PATH}. O arquivo corrompido foi preservado em ${backupPath}. Corrija ou restaure um backup valido.`);
  }
}

module.exports = {
  MODULE_KEYS,
  nowIso,
  randomId,
  fullPermissions,
  sanitizePermissions,
  ensureDataDir,
  loadDb,
  saveDb,
};
