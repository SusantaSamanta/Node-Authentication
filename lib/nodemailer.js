import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: "gmail",   // To send verification email we use this 
  secure: true, // true for 465, false for other ports
  hostname: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.GMAIL_FOR_SENDMAIL,
    pass: process.env.GMAIL_FOR_SENDMAIL_PW, // dot give space between PW
  },
});

export const sendEmail = async ({ to, subject, html }) => { // this fun is use in 'resendVerificationEmail' controller

  try {
    const emailResponse = await transporter.sendMail({
      from: `COUNTRY APP <${process.env.GMAIL_FOR_SENDMAIL}>`,
      to,
      subject,
      html,
    });
    console.log('VERIFICATION EMAIL SENDED TO : ', emailResponse.accepted);
  } catch (error) {
    console.log('ERROR FOR MAIL SEND : ', error);
  }

}




