import { Resend } from 'resend';

// Ensure you set RESEND_API_KEY in your .env.local
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;
