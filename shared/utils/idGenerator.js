import { randomBytes } from "crypto";

export function generateId(prefix = "") {
  const random = randomBytes(8).toString("hex");
  return prefix ? `${prefix}_${random}` : random;
}

export function generateReferralCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}
