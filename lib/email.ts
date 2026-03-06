import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = "sangbackyeo@gmail.com";

/** Notify site owner when someone subscribes. Uses same Resend key; from address should be a verified sender (e.g. RESEND_FROM). */
async function notifyNewSubscriber(subscriberEmail: string): Promise<void> {
  if (!resend) return;
  const from = process.env.RESEND_FROM ?? "Cubing with Micah <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: NOTIFY_EMAIL,
    subject: `New feed subscriber: ${subscriberEmail}`,
    text: `Someone subscribed to the feed.\n\nEmail: ${subscriberEmail}\n\n(Cubing with Micah subscription form)`,
  });
}

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
  await notifyNewSubscriber(email);
  return { ok: true };
}
