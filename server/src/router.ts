import express from 'express';
import {emailSignUP, resendVerifcationEmail} from './controller';
const router = express.Router();

router.post('/api/v1/signup/email', emailSignUP);
router.get('/api/v1/signup/resendverificationemail', resendVerifcationEmail);

export {router};
