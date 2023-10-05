import express from 'express';
import {
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
} from './controller';
const router = express.Router();

router.post('/api/v1/signup/email', emailSignUp);
router.get('/api/v1/signup/resendverificationemail', resendVerifcationEmail);
router.get('/api/v1/signup/verifyemail', verifyEmail);
router.post('/api/v1/signin/email', emailSignIn);
router.get('/api/v1/signin/autoauthentication', autoAuthentication);
router.delete('/api/v1/signout', signOut);
router.get('/api/v1/oauth/google', googleOAuth);
router.get('/api/v1/dashboard/userlist', dashBoardUserList);
router.get('/api/v1/dashboard/userstatistics', dashBoardUserStatistics);
router.put('/api/v1/profile/changename', changeName);
router.put('/api/v1/profile/changepassword', changePassword);

export {router};
