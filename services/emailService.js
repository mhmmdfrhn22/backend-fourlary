const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetPasswordEmail = async (email, token) => {
    try {
        await resend.emails.send({
            from: "Fourlary <noreply@farhanfym.my.id>",
            to: email,
            subject: 'Reset Password',
            html: `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #0046d1;
            text-align: center;
            font-size: 22px;
          }
          p {
            color: #333;
            font-size: 16px;
            line-height: 1.5;
          }
          .button {
            display: block;
            width: 100%;
            max-width: 200px;
            margin: 20px auto;
            padding: 15px;
            background-color: #0046d1;
            color: white;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 8px;
            cursor: pointer;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Password</h2>
          <p>Hi,</p>
          <p>Untuk mereset password Anda, klik tombol di bawah ini:</p>
          <a href="https://fourlary.farhanfym.my.id/reset-password?token=${token}" target="_blank" class="button">Reset Password</a>
          <p>Tautan ini berlaku selama 15 menit. Setelah waktu tersebut, Anda perlu meminta ulang untuk reset password.</p>
          <div class="footer">
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          </div>
        </div>
      </body>
    </html>
  `
        });

        console.log('Reset password email sent.');
    } catch (error) {
        console.error('Error sending reset password email:', error);
    }
};

module.exports = { sendResetPasswordEmail };
