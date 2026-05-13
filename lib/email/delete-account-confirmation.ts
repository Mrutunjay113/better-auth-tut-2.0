import { sendEmail } from "./send-emails";

interface DeleteAccountConfirmationData {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

export async function sendDeleteAccountConfirmationEmail({
  user,
  url,
}: DeleteAccountConfirmationData) {
  await sendEmail({
    to: user.email,
    subject: "Delete Account Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Account Deletion</h2>
        <p>Hello ${user.name},</p>
        <p>We are sorry to see you go. Please click the button below to confirm your account deletion:</p>
        <a href="${url}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Delete Account</a>
        <p>If you don't have an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `Hello ${user.name},\n\nWe are sorry to see you go. Please click the button below to confirm your account deletion: ${url}\n\nIf you don't have an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
  });
}
