/* eslint-disable class-methods-use-this */

const config = require("../config/config");
const logger = require("../config/logger");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
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

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

class EmailHelper {
  constructor() {
    this.email = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.PASSWORD
      }
    })
  }

  async sendSlipGaji(to, attachment){
    try{
      const currentDate = new Date().toISOString().split('T')[0]
      await this.email.sendMail(
        { from: process.env.EMAIL_FROM, to, subject: `Slip Gaji - ${currentDate}` },
        attachment
      )
    }catch(e){
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
      readHTMLFile(body, function (err, html) {
        if (err) {
          console.log("error reading file", err);
          return;
        }
        var template = handlebars.compile(html);
        var replacements = {
          url: webUrl,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: from,
          to: to,
          subject: subject,
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
          }
        });
      });
    } catch (err) {
      console.log(err);
      logger.error(err);
      return false;
    }
  }
}

module.exports = EmailHelper;
