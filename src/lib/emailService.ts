import emailjs from '@emailjs/browser';
import type { EmailJSConfig } from './types';

/**
 * Send an email directly using EmailJS (no mail client needed).
 * Returns { ok: true } on success or { ok: false, error: string } on failure.
 */
export async function sendEmail(
  config: EmailJSConfig,
  to: string,
  subject: string,
  body: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        to_email: to,
        subject: subject,
        message: body,
      },
      config.publicKey
    );
    return { ok: true };
  } catch (err: any) {
    const message =
      err?.text ?? err?.message ?? 'Unknown error sending email.';
    return { ok: false, error: message };
  }
}

/**
 * Check if EmailJS is configured.
 */
export function isEmailJSConfigured(config?: EmailJSConfig): boolean {
  return !!(config?.serviceId && config?.templateId && config?.publicKey);
}
