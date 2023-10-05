import {Request, Response, NextFunction} from 'express';
import {
  checkEmailAccountExist,
  createEmailAccount,
  setEmailAccountAsVerified,
  getEmailUserInfo,
  checkSignInEmail,
  checkSignInPassword,
  updateLastSessionTS,
  updateLoginTimesAndLastSessionTS,
  getDashBoardUserList,
  getDashBoardStatistics,
  changeUserName,
  changeUserPassword,
  checkGoogleOauthAccountExist,
  createGoogleOAuthAccount,
  updateGoogleOAuthAccount,
  getGoogleUserInfo,
} from './model';
import {
  sendEmail,
  verifyEmailToken,
  testPassword,
  createAuthenticationToken,
  verifyAuthenticationToken,
  getGoogleOAuthToken,
} from './utils';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const emailSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (testPassword(req.body.password, req.body.passwordCheck)) {
      if (!(await checkEmailAccountExist(req.body.email))) {
        await sendEmail(req.body.email);
        await createEmailAccount(req.body);
        res.status(200).json({
          message:
            'Sign Up Success. A verification email is sent to your email account.',
        });
      } else {
        res.status(400).json({message: 'You have already signed up.'});
      }
    } else {
      res
        .status(400)
        .json({message: 'Invalid Password or Password Check Failed.'});
    }
  } catch (err) {
    next(err);
  }
};

const resendVerifcationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await sendEmail(req.query.email as string);
    res.status(200).json({
      message: 'A new verification email is sent to your email account.',
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email = verifyEmailToken(req.query.token as string);
    if (email === undefined) {
      res.status(400).json({message: 'Invalid token.'});
      return;
    }
    if (!(await checkEmailAccountExist(email))) {
      if (await setEmailAccountAsVerified(email)) {
        const userInfo = await getEmailUserInfo(email);
        const authenticationJWT = createAuthenticationToken(userInfo);
        res.cookie(
          process.env.authentication_token_name as string,
          authenticationJWT,
          {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 30 * 1000,
          }
        );
        res.redirect(process.env.frontend_path as string);
      } else {
        res.status(400).json({message: "The email account doesn't exist."});
      }
    } else {
      res
        .status(400)
        .json({message: 'The email account has already been verified.'});
    }
  } catch (err) {
    next(err);
  }
};

const emailSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (await checkSignInEmail(req.body.email)) {
      if (await checkSignInPassword(req.body.email, req.body.password)) {
        const userInfo = await getEmailUserInfo(req.body.email);
        const authenticationJWT = createAuthenticationToken(userInfo);
        await updateLoginTimesAndLastSessionTS('email', req.body.email);
        res.cookie(
          process.env.authentication_token_name as string,
          authenticationJWT,
          {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 30 * 1000,
          }
        );
        res.status(200).json({message: 'Login Success.', data: userInfo});
      } else {
        res.status(400).json({message: 'Invalid password.'});
      }
    } else {
      res
        .status(400)
        .json({message: 'The email does not exist or has not been verified.'});
    }
  } catch (err) {
    next(err);
  }
};

const autoAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo = verifyAuthenticationToken(
      req.cookies[process.env.authentication_token_name as string]
    );
    if (userInfo !== undefined) {
      await updateLastSessionTS(userInfo.type, userInfo.email);
      res
        .status(200)
        .json({message: 'The authentication token is valid.', data: userInfo});
    } else {
      res.status(400).json({message: 'The authentication token is invalid.'});
    }
  } catch (err) {
    next(err);
  }
};

const signOut = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.cookie(process.env.authentication_token_name as string, '', {
      maxAge: 0,
    });
    res.status(200).json({message: 'Logout Success.'});
  } catch (err) {
    next(err);
  }
};

const dashBoardUserList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo = verifyAuthenticationToken(
      req.cookies[process.env.authentication_token_name as string]
    );
    if (userInfo === undefined) {
      res.cookie(process.env.authentication_token_name as string, '', {
        maxAge: 0,
      });
      res.status(400).json({message: 'The authentication token is invalid.'});
      return;
    }
    const userList = await getDashBoardUserList();
    res.status(200).json({data: userList});
  } catch (err) {
    next(err);
  }
};

const dashBoardUserStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo = verifyAuthenticationToken(
      req.cookies[process.env.authentication_token_name as string]
    );
    if (userInfo === undefined) {
      res.cookie(process.env.authentication_token_name as string, '', {
        maxAge: 0,
      });
      res.status(400).json({message: 'The authentication token is invalid.'});
      return;
    }
    const userStatisitcs = await getDashBoardStatistics();
    res.status(200).json({data: userStatisitcs});
  } catch (err) {
    next(err);
  }
};

const changeName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo = verifyAuthenticationToken(
      req.cookies[process.env.authentication_token_name as string]
    );
    if (userInfo === undefined) {
      res.cookie(process.env.authentication_token_name as string, '', {
        maxAge: 0,
      });
      res.status(400).json({message: 'The authentication token is invalid.'});
      return;
    }
    if (req.body.newName.length < 1) {
      res.status(400).json({message: 'User name too short.'});
      return;
    }
    await changeUserName(userInfo.email, userInfo.type, req.body.newName);
    const newUserInfo = {
      id: userInfo.id,
      type: userInfo.type,
      email: userInfo.email,
      name: req.body.newName,
    };
    const authenticationJWT = createAuthenticationToken(newUserInfo);
    res.cookie(
      process.env.authentication_token_name as string,
      authenticationJWT,
      {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 30 * 1000,
      }
    );
    res.status(200).json({message: 'Change name success.', data: newUserInfo});
  } catch (err) {
    next(err);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo = verifyAuthenticationToken(
      req.cookies[process.env.authentication_token_name as string]
    );
    if (userInfo === undefined) {
      res.cookie(process.env.authentication_token_name as string, '', {
        maxAge: 0,
      });
      res.status(400).json({message: 'The authentication token is invalid.'});
      return;
    }
    if (!(await checkSignInPassword(userInfo.email, req.body.oldPassword))) {
      res.status(400).json({message: 'Old password is incorrect.'});
      return;
    }
    if (testPassword(req.body.newPassword, req.body.newPasswordCheck)) {
      await changeUserPassword(userInfo.email, req.body.newPassword);
      res.status(200).json({message: 'Change password success.'});
    } else {
      res.status(400).json({
        message:
          'Re-entered password does not match or The new password is invalid.',
      });
    }
  } catch (err) {
    next(err);
  }
};

const googleOAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code;
    const userData = await getGoogleOAuthToken(code as string);
    if (userData === undefined) {
      res.status(400).json({message: 'Invalid google oauth code'});
      return;
    }
    if (!(await checkGoogleOauthAccountExist(userData.email))) {
      await createGoogleOAuthAccount(userData.email, userData.name);
    } else {
      await updateGoogleOAuthAccount(userData.email);
    }
    const userInfo = await getGoogleUserInfo(userData.email);
    const authenticationJWT = createAuthenticationToken(userInfo);
    res.cookie(
      process.env.authentication_token_name as string,
      authenticationJWT,
      {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 30 * 1000,
      }
    );
    res.redirect(process.env.frontend_path as string);
  } catch (err) {
    next(err);
  }
};

export {
  emailSignUp,
  resendVerifcationEmail,
  verifyEmail,
  emailSignIn,
  autoAuthentication,
  signOut,
  dashBoardUserList,
  dashBoardUserStatistics,
  changeName,
  changePassword,
  googleOAuth,
};
