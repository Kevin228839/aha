const brevo = require('@getbrevo/brevo');
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const sendEmail = async (reciever: string) => {
  const defaultClient = brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.sib_api_key;
  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = 'Email verification';
  sendSmtpEmail.htmlContent =
    '<html><body><h1>Click the link to verify your account</h1><a href="https://google.com">verify</a></body></html>';
  sendSmtpEmail.sender = {
    email: 'example@example.com',
    name: 'aha interviewee',
  };
  sendSmtpEmail.to = [{email: reciever}];
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

const testPassword = (password: string): boolean => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[a-zA-Z\d#$@!%&*?]{8,}$/;
  return re.test(password);
};

export {sendEmail, testPassword};
