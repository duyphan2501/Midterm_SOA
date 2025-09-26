const tuitionSuccessEmail = (payer, tuition, amount, date) => {
  return {
    subject: "Tuition Payment Successful",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <div style="background: #27ae60; color: white; padding: 15px; text-align: center; font-size: 20px;">
            Tuition Payment Confirmation
          </div>
          <div style="padding: 20px;">
            <p>Hi <b>${payer}</b>,</p>
            <p>We are pleased to inform you that your tuition payment has been processed successfully.</p>
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 6px; background: #fdfdfd;">
              <p><b>Tuition:</b> ${tuition}</p>
              <p><b>Amount Paid:</b> ${amount.toLocaleString()} VNĐ</p>
              <p><b>Payment Date:</b> ${date}</p>
            </div>
            <p>Thank you for your prompt payment. You can now continue to access your courses without interruption.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Our App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };
};

export default tuitionSuccessEmail;
