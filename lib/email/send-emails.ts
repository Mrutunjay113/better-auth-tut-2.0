import { Resend } from "resend";
import { transporter } from "./node-mailer";
// import nodemailer from "nodemailer";

// export async function sendEmail({
//   to,
//   subject,
//   html,
//   text,
// }: {
//   to: string;
//   subject: string;
//   html: string;
//   text: string;
// }) {
//   const resend = new Resend(process.env.RESEND_API_KEY);

//   await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: to,
//     subject: subject,
//     html: html,
//     text: text,
//   });
//   console.log("Email sent successfully", { to, subject, html, text });
// }

// export async function sendEmail({
//   to,
//   subject,
//   html,
//   text,
// }: {
//   to: string;
//   subject: string;
//   html: string;
//   text: string;
// }) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
//       port: Number(process.env.SMTP_PORT) || 587,
//       secure: false, // true for 465, false for 587
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"Acme" <${process.env.SMTP_FROM}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Email error:", error);
//     throw error;
//   }
// }

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
  await transporter.sendMail({
    from: `"Mrutunjay" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
