const fs = require("node:fs");
const path = require("node:path");

const APP_ROOT = path.join(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(APP_ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) return;
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");
    process.env[key] = value;
  });
}

loadEnvFile();

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const APP_BASE_URL = process.env.APP_BASE_URL || `http://127.0.0.1:${PORT}`;
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "sanan_session";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 8);
const BODY_LIMIT_BYTES = Number(process.env.BODY_LIMIT_BYTES || 5_000_000);

const DATA_DIR = path.join(APP_ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const AUDIT_PATH = path.join(DATA_DIR, "audit.log");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,
  HOST,
  PORT,
  APP_ROOT,
  APP_BASE_URL,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  BODY_LIMIT_BYTES,
  DATA_DIR,
  DB_PATH,
  AUDIT_PATH,
  BACKUP_DIR,
  MIME_TYPES,
};
