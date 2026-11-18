import { createHash, randomBytes } from "node:crypto";

/**
 * Generates a high-entropy cryptographically secure random token string
 * and its corresponding SHA-256 hash for secure database storage.
 */
export function generateSecureToken(byteLength = 32): { token: string; tokenHash: string } {
  const token = randomBytes(byteLength).toString("base64url");
  const tokenHash = hashToken(token);
  return { token, tokenHash };
}

/**
 * Returns the SHA-256 hexadecimal hash of a raw token.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
