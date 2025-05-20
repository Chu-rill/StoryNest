const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const path = require("path");
require("dotenv").config();

class EmailService {
  constructor() {
    // Set up Nodemailer transport
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_PROVIDER,
      port: process.env.SERVICE_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the path to the email template
    this.welcomeTemplatePath = path.join(__dirname, "../views/welcome.hbs");
  }

  // Method to read the email template file
  async readTemplateFile() {
    try {
      return await fs.readFile(this.welcomeTemplatePath, "utf-8");
    } catch (error) {
      throw new Error(`Error reading email template file: ${error}`);
    }
  }

  // Method to send an email without using a template
  async sendEmail(email, data) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: data.subject,
        text: data.text || "", // Optional plain text fallback
      });
      console.log(`Message sent: ${info.response}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
    }
  }

  // Method to send an email using a template
  async sendEmailWithTemplate(email, data) {
    try {
      // Read and compile the template
      const templateSource = await this.readTemplateFile();
      const emailTemplate = handlebars.compile(templateSource);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: data.subject,
        html: emailTemplate({
          PlatformName: "ThreadLog",
          Username: data.username,
          title: "Welcome Email",
        }),
      });

      console.log(`Message sent: ${info.response}`);
    } catch (error) {
      console.error(`Error sending email with template: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
