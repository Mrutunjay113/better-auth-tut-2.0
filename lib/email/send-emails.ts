import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: to,
    subject: subject,
    html: html,
    text: text,
  });
  console.log("Email sent successfully", { to, subject, html, text });
}
