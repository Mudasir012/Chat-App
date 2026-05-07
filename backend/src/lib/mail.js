import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_EMAIL_TEMPLATE } from "./emailTemplates.js";
//Added email service
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

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: `"ChatApp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "VERIFY YOUR EMAIL 📧",
      html: VERIFICATION_EMAIL_TEMPLATE(verificationToken),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: " + info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"ChatApp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "PASSWORD RESET 🔑",
      html: PASSWORD_RESET_EMAIL_TEMPLATE(resetUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: " + info.response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
