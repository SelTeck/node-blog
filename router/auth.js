
import express from 'express';
import * as authData from '../controller/auth.js';

const router = express.Router();

//router.get(`/`)

router.get('/hello', authData.hello);
router.post('/users', authData.signIn); 
router.get('/stimulus', authData.getStimulusInfo);
// router.get('');

export default router;  