import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_PROVIDER'),
      port: parseInt(this.configService.get<string>('SERVICE_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(email: string, data: { subject: string; text?: string; html?: string }) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
      console.log(`Message sent: ${info.response}`);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendEmailWithTemplate(email: string, data: { subject: string; username: string }) {
    try {
      const templatePath = path.join(__dirname, '../../views/welcome.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf-8');
      const emailTemplate = handlebars.compile(templateSource);

      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: data.subject,
        html: emailTemplate({
          PlatformName: 'StoryNest',
          Username: data.username,
          title: 'Welcome Email',
        }),
      });

      console.log(`Message sent: ${info.response}`);
      return info;
    } catch (error) {
      console.error('Error sending templated email:', error);
      throw error;
    }
  }
}
