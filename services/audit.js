const fs = require("node:fs");
const { AUDIT_PATH } = require("./config");
const { ensureDataDir, nowIso } = require("./data-store");

function audit(entry) {
  ensureDataDir();
  fs.appendFileSync(AUDIT_PATH, JSON.stringify({ timestamp: nowIso(), ...entry }) + "\n", "utf8");
}

function readAudit(limit = 100) {
  ensureDataDir();
  if (!fs.existsSync(AUDIT_PATH)) return [];

  return fs.readFileSync(AUDIT_PATH, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-limit)
    .reverse()
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { timestamp: nowIso(), action: "audit_parse_error", raw: line };
      }
    });
}

module.exports = {
  audit,
  readAudit,
};
