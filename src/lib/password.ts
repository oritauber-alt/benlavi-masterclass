import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure random password.
 * Format: 16 alphanumeric characters (96 bits of entropy).
 */
export function generateSecurePassword(): string {
  // 16 bytes base64 = 22 chars, strip non-alphanumeric and slice to 16
  return randomBytes(16)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 16)
    .padEnd(16, "x");
}
