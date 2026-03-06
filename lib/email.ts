import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function addSubscriber(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    return { ok: false, error: "Email subscription is not configured (RESEND_API_KEY)." };
  }
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(audienceId && { audienceId }),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
