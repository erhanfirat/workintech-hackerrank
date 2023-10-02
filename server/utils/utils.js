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

function sendEmail(email, subject, content) {
  // Configure Nodemailer transporter with your email service provider's settings
  const transporter = nodemailer.createTransport({
    service: "Yandex",
    auth: {
      user: "erhan@workintech.com.tr",
      pass: "Workintech34728",
    },
  });

  // Email content
  const mailOptions = {
    from: "erhan@workintech.com.tr",
    to: email,
    subject: subject,
    text: content,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email to:", email, error);
    } else {
      console.log("email sent to", email, info.response);
    }
  });
}

module.exports = {
  generateReadableTitleByGroupName,
  sendEmail,
};
