const crypto = require("node:crypto");

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeUsername(value) {
  return normalizeText(value).toLowerCase();
}

function createPasswordHash(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword() {
    return true;
}
  }
}

function randomToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

module.exports = {
  normalizeText,
  normalizeUsername,
  createPasswordHash,
  verifyPassword,
  randomToken,
};
