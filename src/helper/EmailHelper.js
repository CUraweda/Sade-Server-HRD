/* eslint-disable class-methods-use-this */

const config = require("../config/config");
const { getMonthAndDayRange } = require("../helper/utils")
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

const transporter = nodemailer.createTransport({
  //? GMAIL CONFIG
  // service: "gmail",
  // auth: {
  //   user: config.email.account,
  //   pass: config.email.password
  // }

  //? SMTP CONFIG
  host: config.email.host,
  port: +config.email.port,
  secure: true,
  auth: {
    user: config.email.account,
    pass: config.email.password,
  },
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

  async sendSlipGaji(to, slipGajiPath) {
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      await this.email.sendMail(
        {
          from: process.env.EMAIL_FROM, to, subject: `Slip Gaji - ${currentDate}`,
          attachments: [
            {
              filename: 'slip-gaji.pdf',
              path: slipGajiPath
            }
          ]
        },
      )
    } catch (e) {
      console.log(e)
    }
  }

  async sendExcelEvaluation(to, data = {}) {
    try {
      const { employee, path } = data
      const currentMonth = new Date().getMonth() + 1
      await this.email.sendMail(
        {
          from: process.env.EMAIL_FROM, to, subject: `Evaluasi Penilaian - ${employee.full_name}`,
          attachments: [
            {
              filename: `Evaluasi ${employee.full_name} Bulan ${currentMonth}.xlsx`,
              path
            }
          ]
        },
      )
    } catch (e) {
      console.log(e)
    }
  }



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

  async sendSecondEvaluation(to, data) {
    try {
      const filePath = data.divison_id != 4 ? "../views/lulus_interview_pelamar_bukan_shati.html" : "../views/lulus_interview_pelamar_bukan_shati.html"
      readHTMLFile(path.resolve(__dirname, filePath), function (err, html) {
        if (err) {
          console.log("error reading file", err);
          return;
        }

        const template = handlebars.compile(html)
        const probationStartDate = new Date(data.added_data.probation_start_date)
        const probationEndDate = new Date(data.added_data.probation_end_date)
        const htmlFile = template({
          name: data.full_name,
          status: "LULUS",
          date: probationStartDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
          time: probationStartDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          hrd_name: data.hrd_data.full_name,
          probation_due: getMonthAndDayRange(data.added_data.probation_start_date, data.added_data.probation_end_date)
        })
        transporter.sendMail({
          from: config.email.account, to, subject: "Kontrak Kerja - Sekolah Alam Depok",
          html: htmlFile
        }, function (error, response) {
          if (error) console.log(error);
        });
      });
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async sendEvaluationEmail(to, data) {
    try {
      readHTMLFile(path.resolve(__dirname, '../views/applicant_success.html'), function (err, html) {
        if (err) {
          console.log(err)
          return false
        }

        const template = handlebars.compile(html)
        data['company_name'] = 'Sekolah Alam Depok'
        const htmlToSend = template(data)
        const mOpts = {
          from: config.email.account, to, subject: "Hasil Seleksi - Sekolah Alam Depok",
          html: htmlToSend
        }

        transporter.sendMail(mOpts, (err, res) => {
          if (err) return false
        })

        return true
      })
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async sendContractEmail(to, data, buffer_docx) {
    try {
      readHTMLFile(path.resolve(__dirname, '../views/applicant_success2.html'), function (err, html) {
        if (err) return console.log("error reading file", err);

        const template = handlebars.compile(html)
        const htmlData = template(data)
        transporter.sendMail({
          from: config.email.account, to, subject: "Kontrak Kerja - Sekolah Alam Depok",
          html: htmlData,
          attachments: [
            {
              filename: "Kontrak Kerja.docx",
              content: buffer_docx
            }
          ]
        }, function (error, response) {
          if (error) console.log(error);
        });
      });
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

module.exports = EmailHelper;
