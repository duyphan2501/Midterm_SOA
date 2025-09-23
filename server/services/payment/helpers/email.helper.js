import transporter from "../config/email.config.js";
import dotenv from "dotenv";
import otpPaymentEmail from "../templates/otpPaymentEmail.template.js";
import tuitionSuccessEmail from "../templates/tuitionSuccessEmail.template.js";
dotenv.config({ quiet: true });

const sendEmail = async (email, subject, html) => {
  const options = {
    from: `"iBanking" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,
    html,
  };
  const info = await transporter.sendMail(options);
  console.log("Message sent:", info.messageId);
};

const sendOtpCode = async (email, username, otpCode, expMinutes) => {
  const { subject, html } = otpPaymentEmail(username, otpCode, expMinutes);
  await sendEmail(email, subject, html);
};

const sendPaymentSuccessEmail = async (email, fullname, tuition, amount) => {
  const now = new Date()
  // format dd/MM/yyyy HH:mm
  const formattedNow = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const { subject, html } = tuitionSuccessEmail(
    fullname,
    tuition,
    amount,
    formattedNow
  );
  await sendEmail(email, subject, html);
};

export { sendEmail, sendOtpCode, sendPaymentSuccessEmail };
