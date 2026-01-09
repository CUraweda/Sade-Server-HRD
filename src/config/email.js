/* eslint-disable class-methods-use-this */

const config = require("../config/config");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const Email = require('email-templates')
const fs = require("fs");

const transporter = nodemailer.createTransport({
  //? GMAIL CONFIG
  service: "gmail",
  auth: {
    user: config.email.account,
    pass: config.email.password
  }

  //? SMTP CONFIG
  // host: config.email.host,
  // port: config.email.port,
  // secure: true,
  // auth: {
  //   // TODO: replace `user` and `pass` values from <https://forwardemail.net>
  //   user: config.email.account,
  //   pass: config.email.password,
  // },
});


class EmailHelper {
  constructor() {
    this.email = nodemailer.createTransport({
			host: config.email.host,
			port: +config.email.port,
			secure: true,
			auth: {
				user: config.email.account,
				pass: config.email.password,
			},
		});
    this.emailTemplate = new Email({
      message: { from: process.env.EMAIL_ACCOUNT },
      send: true,
      transport: this.email,
      views: {
        root: path.resolve('src/views'),
        options: {
          extension: 'html'
        }
      }
    })
  }
  async renderEmail(templateName, variables) {
    const html = await this.emailTemplate.render(templateName, variables);
    return html;
  }
  async readHTMLFile(path) {
    try {
      const html = await fs.readFile(path, { encoding: "utf-8" });
      return html;
    } catch (err) {
      throw new Error(`Error reading HTML file: ${err.message}`);
    }
  }

  async sendSlipGaji(to, attachment) {
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      const mailOptions = {
        from: config.email.account,
        to,
        subject: `Slip Gaji - ${currentDate}`,
        attachments: attachment ? [attachment] : [], // Ensure attachment is included properly
      };

      await this.email.sendMail(mailOptions);
    } catch (e) {
      console.log(e)
    }
  }

  async sendEmail(
    webUrl,
    from,
    to,
    subject,
    body,
    auth = null,
    attachment = false
  ) {
    try {
      const html = await this.readHTMLFile(templatePath);
      const template = handlebars.compile(html);
      const replacements = { url: webUrl };
      const htmlToSend = template(replacements);

      const mailOptions = {
        from,
        to,
        subject,
        html: htmlToSend,
        ...(attachment && { attachments: [attachment] }), // Include attachments if provided
      };

      // Send the email
      await this.email.sendMail(mailOptions);
    } catch (err) {
      console.log(err)
      return false;
    }
  }
}

module.exports = EmailHelper;
