import express from 'express';
import {emailSignUP} from './controller';
const router = express.Router();

router.post('/api/v1/signup/email', emailSignUP);

export {router};
