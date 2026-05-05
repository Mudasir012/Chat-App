import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"ChatApp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "WELCOME TO CHATAPP 🚀",
      html: WELCOME_EMAIL_TEMPLATE(name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: " + info.response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
