import {Request, Response, NextFunction} from 'express';
import {checkEmailExist, registerEmail} from './model';
import {sendEmail, testPassword} from './utils';

const emailSignUP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (testPassword(req.body.password, req.body.passwordCheck)) {
      if (!(await checkEmailExist(req.body))) {
        await sendEmail(req.body.email);
        await registerEmail(req.body);
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
      message: 'A verification email is sent to your email account.',
    });
  } catch (err) {
    next(err);
  }
};

export {emailSignUP, resendVerifcationEmail};
