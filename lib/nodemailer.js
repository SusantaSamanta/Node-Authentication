import nodemailer from "nodemailer";
import 'dotenv/config';

const transport = nodemailer.createTransport({
    services: 'gmail',
    host: 'smtp.gmail.com',  //Required to avoid localhost errors
    secure: true,
    port: 465,
    auth: {
        user: process.env.GMAIL_FOR_MAIL_SEND,
        pass: process.env.GMAIL_PASS_FOR_SEND_MAIL,
    },
});

export const sendEmail = async ({ to, subject, html }) => { // this fun is use in 'resendVerificationEmail' controller
  console.log("Sending email to:", to)
  try {
    const emailResponse = await transport.sendMail({
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




