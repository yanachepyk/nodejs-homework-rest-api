const sgMail = require("@sendgrid/mail");

const { BASE_URL, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = ({ email, verificationToken }) => {
  return sgMail.send({
    to: email,
    from: 'yanapgp@gmail.com',
    subject: "Please verify your email address for NodeJs homework",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">Verify email</a>`,
  });
};

module.exports = sendVerificationEmail;
