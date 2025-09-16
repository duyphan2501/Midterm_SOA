import transporter from "../config/email.config.js";
import dotenv from "dotenv";
import otpPaymentEmail from "../templates/otpPaymentEmail.template.js";
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

const sendOtpCode = async(email, username, otpCode) => {
  const {subject, html } = otpPaymentEmail(username, otpCode, 5)
  await sendEmail(email, subject, html)
}


export { sendEmail, sendOtpCode };
