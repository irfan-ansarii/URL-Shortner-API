import "dotenv/config";
import path from "path";
import ejs from "ejs";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { EMAIL_API_TOKEN, APP_NAME } from "../../config/CONSTANTS";

const mailerSend = new MailerSend({
  apiKey: EMAIL_API_TOKEN!,
});
const sentFrom = new Sender(
  "mailer@trial-yzkq340k613gd796.mlsender.net",
  APP_NAME
);

const getTemplate = async (template: string, data: {}) => {
  const file = path.join(__dirname, "..", "templates", "template.ejs");

  const html = await ejs.renderFile(
    file,
    {
      template,
      ...data,
    },
    { async: true }
  );

  return html;
};

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  data: {}
) => {
  const recipients = [new Recipient(to)];
  try {
    const html = await getTemplate(template, { email: to, ...data });

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(html);

    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.log(error);
  }
};
