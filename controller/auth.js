
import { config } from '../config.js';
import * as authRepository from '../data/auth.js';
import jwt from 'jsonwebtoken';

// Get users/:userId
export async function signIn(req, res) {
    console.log(`called signIn function`);
    // let userId = req.params.userId;
    let userId = req.body;
    console.log(`userId is ${userId}`);

    const result = await authRepository.findById(userId);

    if (!result) {
        return res.status(401).json({message: 'Invalid user or password'});
    }
    
    let token = createJwtToken(userId);
    res.status(200).json({token});
}

function createJwtToken(id) {
    return jwt.sign({ 
            id: id,
            isAdmin: false 
        }, config.jwt.secretKey, {
            expiresIn: config.jwt.expiresInSec,
        }
    );
  }