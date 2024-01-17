import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

const sendEmail = async (options) => {
  try {
    //SENDGRID
    const transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_APIKEY,
        },
      })
    );
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.message,
    };

    await transport.sendMail(mailOptions);
  } catch (err) {
    console.log("Error send mail", err);
    throw err;
  }
};
export default sendEmail;
