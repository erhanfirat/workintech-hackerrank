const generateReadableTitleByGroupName = (name) => {
  name = name.trim().replace("FSWEB", "");
  const part = name[0] == "P" ? " (Part Time) " : "";
  name = name[0] == "P" ? name.slice(1) : name;
  const monthName = Intl.DateTimeFormat("tr", { month: "long" }).format(
    new Date(name.substring(0, 2))
  );
  return `Fsweb ${name} - ${monthName}${part}`;
};

const nodemailer = require("nodemailer");

function sendEmail(email, subject, content, attachments) {
  // Configure Nodemailer transporter with your email service provider's settings
  const transporter = nodemailer.createTransport({
    service: "Yandex",
    auth: {
      user: process.env.HACKERRANK_EMAIL,
      pass: process.env.HACKERRANK_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.HACKERRANK_EMAIL,
    to: email,
    subject,
    html: content,
    attachments,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("<" + subject + "> email sent to <" + email + "> ", error);
    } else {
      console.log(
        "<" + subject + "> email sent to <" + email + "> ",
        info.response
      );
    }
  });
}

module.exports = {
  generateReadableTitleByGroupName,
  sendEmail,
};
