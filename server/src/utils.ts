const brevo = require('@getbrevo/brevo');
import dotenv from 'dotenv';
import path from 'path';
import jwt, {JwtPayload} from 'jsonwebtoken';
import axios from 'axios';
import qs from 'qs';
import {GoogleOAuthResponse} from './types';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const sendEmail = async (receiver: string): Promise<void> => {
  const defaultClient = brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.sib_api_key;
  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  const token = jwt.sign(
    {email: receiver},
    process.env.jwt_private_key as string,
    {expiresIn: 60 * 30}
  );

  sendSmtpEmail.subject = 'Email verification';
  sendSmtpEmail.htmlContent = `<html><body><h1>Click the link to verify your account. The link will expire in 30 minutes.</h1><a href="${process.env.server_protocol}://${process.env.server_address}/api/v1/signup/verifyemail?token=${token}">verify</a></body></html>`;
  sendSmtpEmail.sender = {
    email: 'example@example.com',
    name: 'aha interviewee',
  };
  sendSmtpEmail.to = [{email: receiver}];
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

const verifyEmailToken = (token: string): string | undefined => {
  try {
    const decode = jwt.verify(
      token,
      process.env.jwt_private_key as string
    ) as JwtPayload;
    return decode.email;
  } catch (err) {
    return undefined;
  }
};

const testPassword = (password: string, passwordCheck: string): boolean => {
  if (password !== passwordCheck) {
    return false;
  }
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[a-zA-Z\d#$@!%&*?]{8,}$/;
  return re.test(password);
};

const createAuthenticationToken = (userInfo: object): string => {
  const authenticationJWT = jwt.sign(
    userInfo,
    process.env.jwt_private_key as string,
    {expiresIn: 60 * 30}
  );
  return authenticationJWT;
};

const verifyAuthenticationToken = (token: string): JwtPayload | undefined => {
  try {
    const decode = jwt.verify(
      token,
      process.env.jwt_private_key as string
    ) as JwtPayload;
    return decode;
  } catch (err) {
    return undefined;
  }
};

const getGoogleOAuthToken = async (
  code: string
): Promise<GoogleOAuthResponse | undefined> => {
  try {
    const url = 'https://oauth2.googleapis.com/token';
    const value = {
      code,
      client_id: process.env.google_oauth_client_id,
      client_secret: process.env.google_oauth_client_secret,
      redirect_uri: process.env.google_oauth_redirect_uri,
      grant_type: 'authorization_code',
    };
    const data = await axios.post(url, qs.stringify(value), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const userData = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.data.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${data.data.id_token}`,
        },
      }
    );
    console.log(userData.data);
    return userData.data;
  } catch (err) {
    return undefined;
  }
};

export {
  sendEmail,
  verifyEmailToken,
  testPassword,
  createAuthenticationToken,
  verifyAuthenticationToken,
  getGoogleOAuthToken,
};
