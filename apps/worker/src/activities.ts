import crypto from "crypto";
import type { SendEmailResult } from "@cadence/shared";

/**
 * Mock SEND_EMAIL activity.
 * Logs the action and always returns success – no real email provider is called.
 */
export async function sendEmail(
  contactEmail: string,
  subject: string,
  body: string,
): Promise<SendEmailResult> {
  const messageId = crypto.randomUUID();
  const timestamp = Date.now();

  console.log(
    `[MOCK EMAIL] To: ${contactEmail} | Subject: "${subject}" | Body: "${body}" | MessageId: ${messageId}`,
  );

  return {
    success: true,
    messageId,
    timestamp,
  };
}
