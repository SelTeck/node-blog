
import express from 'express';
import * as authData from '../controller/auth.js';

const router = express.Router();

//router.get(`/`)

router.get('/users/:userId', authData.signIn);

export default router;  