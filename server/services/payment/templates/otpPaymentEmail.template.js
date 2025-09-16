const otpPaymentEmail = (payer, otp, expireMinutes) => {
  return {
    subject: "Payment OTP Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <div style="background: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 20px;">
            Payment Verification 
          </div>
          <div style="padding: 20px;">
            <p>Hi <b>${payer}</b>,</p>
            <p>To complete your payment, please use the OTP below:</p>
            <h1 style="letter-spacing: 4px; color:#2c3e50; text-align:center;">${otp}</h1>
            <p>This OTP will expire in <strong>${expireMinutes} minutes</strong>. Please do not share it with anyone for your security.</p>
            <p>If you did not attempt this transaction, please contact our support immediately.</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Our App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };
};

export default otpPaymentEmail;
