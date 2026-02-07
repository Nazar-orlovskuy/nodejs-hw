import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const message = {
    from: options.from || process.env.SMTP_FROM,
    ...options,
  };

  return transporter.sendMail(message);
};
