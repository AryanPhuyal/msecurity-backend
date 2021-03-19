import nodemailer from "nodemailer";
import dotenv from "../../utils/dotenv";

export default class sendMail {
  private emailTO!: string;
  private message!: string;
  private subject!: string;
  private email!: string;
  private password!: string;
  private service!: string;
  constructor(emailTo: string, message: string, subject: string) {
    this.emailTO = emailTo;
    this.message = message;
    this.subject = subject;
    this.email = dotenv.EMAIL!;
    this.password = dotenv.PASSWORD!;
    this.service = dotenv.SERVICE!;
  }
  sendMail() {
    var transporter = nodemailer.createTransport({
      service: this.service,
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
    var mailOptions = {
      from: "mscurity.app.com",
      to: this.emailTO,
      subject: this.subject,
      text: this.message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        return true;
      }
    });
  }
}
