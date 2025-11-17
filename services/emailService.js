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
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #007bff;
              text-align: center;
            }
            .content {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: white;
              font-size: 16px;
              padding: 15px 25px;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              margin-top: 20px;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #0056b3;
            }
            footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Reset Password Anda</h2>
            <div class="content">
              <p>Untuk mereset password Anda, silakan klik tombol di bawah ini:</p>
              <a href="https://fourlary.farhanfym.my.id/reset-password?token=${token}" target="_blank" class="button">Reset Password</a>
            </div>
            <footer>
              <p>Terima kasih telah menggunakan Fourlary.</p>
              <p>Jika Anda tidak meminta reset password, mohon abaikan email ini.</p>
            </footer>
          </div>
        </body>
      </html>
    `,
        });
        console.log('Reset password email sent.');
    } catch (error) {
        console.error('Error sending reset password email:', error);
    }
};

module.exports = { sendResetPasswordEmail };
