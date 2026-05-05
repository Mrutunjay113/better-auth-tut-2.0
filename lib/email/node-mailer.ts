// 1. Create a transporter
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
