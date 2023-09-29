import {Request, Response, NextFunction} from 'express';
import {checkEmailExist, registerEmail} from './model';
import {sendEmail, testPassword} from './utils';

const emailSignUP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (testPassword(req.body.password)) {
      if (!(await checkEmailExist(req.body))) {
        await registerEmail(req.body);
        await sendEmail(req.body.email);
        res.status(200).json({message: 'Sign UP Success'});
      } else {
        res.status(400).json({message: 'Already Signed Up'});
      }
    } else {
      res.status(400).json({message: 'Invalid Password'});
    }
  } catch (err) {
    next(err);
  }
};

export {emailSignUP};
