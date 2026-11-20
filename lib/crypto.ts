import crypto from "crypto";

// 32-byte key derived from env or persistent app secret
const MASTER_KEY_SEED = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "forgeflow-industrial-aes256-gcm-master-key-seed-2026";
const MASTER_KEY = crypto.createHash("sha256").update(MASTER_KEY_SEED).digest();

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a sensitive string (CMS API key, webhook secret, OAuth token)
 * Returns a self-contained string format: `iv:authTag:encryptedHex`
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("[Crypto] Encryption failed:", err);
    throw new Error("Failed to securely encrypt secret.");
  }
}

/**
 * Decrypts a secret formatted as `iv:authTag:encryptedHex`
 * Backward-compatible with unencrypted legacy tokens
 */
export function decryptSecret(cipherText: string): string {
  if (!cipherText) return "";
  // Check if string matches our GCM format: iv (24 hex) : tag (32 hex) : data
  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    // Unencrypted legacy key fallback
    return cipherText;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    if (ivHex.length !== 24 || authTagHex.length !== 32) {
      return cipherText;
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.warn("[Crypto] Decryption failed or legacy token; returning raw string.");
    return cipherText;
  }
}

/**
 * Masks an API key for safe GUI display (e.g. "wp_sec_****************4f2a")
 */
export function maskSecret(secret: string): string {
  if (!secret) return "";
  const decrypted = decryptSecret(secret);
  if (decrypted.length <= 8) {
    return "••••••••";
  }
  const prefix = decrypted.slice(0, 4);
  const suffix = decrypted.slice(-4);
  return `${prefix}${"•".repeat(Math.min(decrypted.length - 8, 16))}${suffix}`;
}
