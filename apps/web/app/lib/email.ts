import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = (to: string, subject: string, html: string) =>
  resend
    ? resend.emails.send({ from: 'noreply@carelink-zambia.com', to, subject, html })
    : console.warn('Email skipped – no RESEND_API_KEY');
