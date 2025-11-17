const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetPasswordEmail = async (email, token) => {
  try {
    await resend.emails.send({
      from: "Fourlary <noreply@farhanfym.my.id>",
      to: email,
      subject: 'Reset Password',
      html: `
        <p>Untuk mereset password Anda, klik tombol di bawah ini:</p>
        <a href="https://fourlary.farhanfym.my.id//reset-password?token=${token}" target="_blank">
          <button>Reset Password</button>
        </a>
      `,
    });
    console.log('Reset password email sent.');
  } catch (error) {
    console.error('Error sending reset password email:', error);
  }
};

module.exports = { sendResetPasswordEmail };
