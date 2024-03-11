const generateReadableTitleByGroupName = (name) => {
  console.log("********************", name);
  name = name.trim().replace("FSWEB", "");
  const part = name[0] == "P" ? " (Part Time) " : "";
  name = name[0] == "P" ? name.slice(1) : name;
  let result = "Fsweb " + name;
  if (isNumeric(name.substring(0, 2))) {
    const monthName = Intl.DateTimeFormat("tr", { month: "long" }).format(
      new Date(name.substring(0, 2))
    );

    result += " " + monthName;
  }

  return result + part;
};

const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
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
      console.error(
        "Email <" + email + "> | Subject <" + subject + "> ",
        error
      );
    } else {
      console.log(
        "Email <" + email + "> | Subject <" + subject + "> ",
        info.response
      );
    }
  });
}

module.exports = {
  generateReadableTitleByGroupName,
  sendEmail,
};
