
import express from 'express';
import * as authData from '../controller/auth.js';

const router = express.Router();

//router.get(`/`)

router.get('/hello', authData.hello);
router.post('/users', authData.signIn); 

export default router;  