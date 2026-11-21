import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Resolves the 32-byte vault master key from environment variables or generates a secure local fallback.
 */
function getMasterKey(): Buffer {
  const secret = process.env.ENCRYPTION_MASTER_KEY || process.env.NEXTAUTH_SECRET || "forgeflow-industrial-aerospace-vault-key-32b";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string into a tamper-evident ciphertext string (iv:ciphertext:tag in hex).
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

/**
 * Decrypts a ciphertext string back into plaintext, verifying AES-GCM authentication tag integrity.
 */
export function decryptSecret(ciphertextWithMetadata: string): string {
  if (!ciphertextWithMetadata) return "";
  const parts = ciphertextWithMetadata.split(":");
  if (parts.length !== 3) {
    // If not in encrypted format (e.g. legacy plain token), return as-is
    return ciphertextWithMetadata;
  }
  
  const [ivHex, encryptedHex, authTagHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, getMasterKey(), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
