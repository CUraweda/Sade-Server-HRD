/* eslint-disable class-methods-use-this */

const config = require("../config/config");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

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
  async sendApplicantEmail(
    dynamic,
    to,
    subject,
    body,
    auth = null,
    attachment = false
  ) {
    try {
      readHTMLFile(path.resolve(__dirname, body), function (err, html) {
        if (err) {
          console.log("error reading file", err);
          return;
        }
        var template = handlebars.compile(html);

        var replacements = {
          company_name: 'Sekolah Alam Depok',
          due_date: dynamic.date,
          status: dynamic.status,
          date: dynamic.date,
          time: dynamic.time,
          address: dynamic.address,
          start_date: dynamic.startDate,
          end_date: dynamic.endDate,
          reason: dynamic.reason,
          position_name: dynamic.positionName,
          next_step: dynamic.nextStep,
          //applicant
          applicant_name: dynamic.applicantName,
          applicant_position: dynamic.applicantPosition,
          applicant_address: dynamic.applicantAddress,
          applicant_phone: dynamic.applicantPhone,
          applicant_email: dynamic.applicantEmail,
          applicant_major: dynamic.applicantMajor,
          applicant_employee: dynamic.applicantEmployee,
          //sender
          sender_name: dynamic.senderName,
          sender_position: dynamic.senderPosition,
          sender_email: dynamic.senderEmail,
          sender_phone: dynamic.senderPhone,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: config.email.account,
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
      return false;
    }
  }
}

module.exports = EmailHelper;
