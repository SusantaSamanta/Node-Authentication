import nodemailer from "nodemailer";
import 'dotenv/config';

// const testAccount = await nodemailer.createTestAccount();



// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailInfo = await transporter.sendMail({ from: `COUNTRY APP <${process.env.ETHEREAL_EMAIL}>`, to, subject, html });
  const verifyLink = nodemailer.getTestMessageUrl(mailInfo);
  console.log("Verify email : ", verifyLink);
}

