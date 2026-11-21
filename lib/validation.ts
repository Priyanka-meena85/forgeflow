/**
 * ForgeFlow Zero-Dependency Type-Safe Schema Validator & Sanitizer
 * Protects API routes against prototype pollution, XSS, and malformed industrial inputs.
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function sanitizeString(val: unknown, maxLength = 1000): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/[<>]/g, "") // basic anti-XSS stripping
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim().toLowerCase()) && email.length <= 254;
}

export interface DemoRequestInput {
  name: string;
  email: string;
  company: string;
  companySize?: string;
  industry?: string;
  useCase?: string;
}

export function validateDemoRequest(body: unknown): ValidationResult<DemoRequestInput> {
  if (!body || typeof body !== "object") {
    return { success: false, errors: { body: "Invalid request payload format." } };
  }

  const raw = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = sanitizeString(raw.name, 100);
  if (!name || name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  const email = sanitizeString(raw.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    errors.email = "Please provide a valid business email address.";
  }

  const company = sanitizeString(raw.company, 150);
  if (!company || company.length < 2) {
    errors.company = "Company name must be at least 2 characters.";
  }

  const companySize = sanitizeString(raw.companySize, 50) || "50-250";
  const industry = sanitizeString(raw.industry, 100) || "Heavy Machinery & Equipment";
  const useCase = sanitizeString(raw.useCase, 2000);

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, email, company, companySize, industry, useCase },
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export function validateLogin(body: unknown): ValidationResult<LoginInput> {
  if (!body || typeof body !== "object") {
    return { success: false, errors: { body: "Invalid login credentials format." } };
  }

  const raw = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const email = sanitizeString(raw.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    errors.email = "Valid email is required.";
  }

  if (typeof raw.password !== "string" || !raw.password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { email, password: String(raw.password) },
  };
}

export interface RegisterInput {
  name?: string;
  email: string;
  companyName: string;
  password: string;
}

export function validateRegister(body: unknown): ValidationResult<RegisterInput> {
  if (!body || typeof body !== "object") {
    return { success: false, errors: { body: "Invalid registration payload format." } };
  }

  const raw = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const email = sanitizeString(raw.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    errors.email = "Valid corporate email is required.";
  }

  const companyName = sanitizeString(raw.companyName, 150);
  if (!companyName || companyName.length < 2) {
    errors.companyName = "Company name must be at least 2 characters.";
  }

  const password = typeof raw.password === "string" ? raw.password : "";
  if (password.length < 8 || password.length > 128) {
    errors.password = "Password must be between 8 and 128 characters.";
  }

  const name = sanitizeString(raw.name, 100) || undefined;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, email, companyName, password },
  };
}
