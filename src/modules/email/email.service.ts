import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Brevo from '@getbrevo/brevo';
@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name)
    private client : any ; 
    private fromEmail: string ; 
    private senderName:string ;
    constructor(private configService: ConfigService){
         // If you're using registerAs('env', ...) then values are inside env.*
  const env = this.configService.get('env') || {};

  // Load API Key (tries both styles)
  const apiKey =
    env.brevoApiKey ??
    this.configService.get('BREVO_API_KEY') ??
    '';
   

  // Sender Email (fallback to default)
  this.fromEmail =
    env.emailFrom ??
    this.configService.get('EMAIL_FROM') ??
    'no-reply@example.com';

  this.senderName = 'Saha';

  // Init Brevo client
  this.client = new Brevo.TransactionalEmailsApi();
  this.client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    }
 async sendVerificationCode(toEmail: string, code: string): Promise<void> {
    try {
      const sendSmtpEmail = {
        to: [{ email: toEmail }],
        sender: { email: this.fromEmail, name: this.senderName },
        subject: 'Your verification code',
        htmlContent: `<html>
          <body style="font-family: Arial, sans-serif; color: #222;">
            <h2>Your verification code</h2>
            <p>Your verification code is: <strong style="font-size: 20px">${code}</strong></p>
            <p>This code expires in ${this.getExpiryMinutes()} minutes.</p>
            <p>If you didn't request this, ignore this email.</p>
          </body>
        </html>`,
      };

      await this.client.sendTransacEmail(sendSmtpEmail);
      this.logger.debug(`Sent verification code to ${toEmail}`);
    } catch (err) {
      this.logger.error('sendVerificationCode error', err);
      throw err;
    }
  }
    private getExpiryMinutes() {
    const env = this.configService.get('env') || {};
    return env?.verificationCodeExpMin ?? parseInt(this.configService.get('VERIFICATION_CODE_EXP_MIN') || '10', 10);
  }
  async sendSimpleEmail(toEmail: string, subject: string, html: string) {
    try {
      const sendSmtpEmail = {
        to: [{ email: toEmail }],
        sender: { email: this.fromEmail, name: this.senderName },
        subject,
        htmlContent: html,
      };
      await this.client.sendTransacEmail(sendSmtpEmail);
      this.logger.debug(`Sent email (${subject}) to ${toEmail}`);
    } catch (err) {
      this.logger.error('sendSimpleEmail error', err);
      throw err;
    }
  }
}
