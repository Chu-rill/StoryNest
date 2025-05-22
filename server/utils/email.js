const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_PROVIDER,
  port: parseInt(process.env.SERVICE_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//read the template file
const templatePath = path.join(__dirname, "../views/welcome.hbs");
const readTemplateFile = async () => {
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    throw new Error(`Error reading email template file: ${error}`);
  }
};

exports.sendEmail = async (email, data) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
    console.log(`message sent: ${info.response}`);
  } catch (error) {
    console.error(error);
  }
};

exports.sendEmailWithTemplate = async (email, data) => {
  try {
    // Read the template file
    const templateSource = await readTemplateFile();
    // Compile the template
    const emailTemplate = handlebars.compile(templateSource);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: data.subject,
      html: emailTemplate({
        PlatformName: "ThreadLog",
        Username: data.username,
        title: "Welcome Email",
      }),
    });
    console.log(`message sent: ${info.response}`);
  } catch (error) {
    console.error(error);
  }
};
