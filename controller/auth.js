
import { config } from '../config.js';
import * as authRepository from '../data/auth.js';
import * as dataRepository from '../data/data.js';

import jwt from 'jsonwebtoken';

export async function hello(req, res, next) {
    console.log(`called hello function`);
    res.status(200).json({message: "Hello!!!!"});
}

// post /auth/users
export async function signIn(req, res, next) {
    console.log(`called signIn function`);
    // let userId = req.params.userId;
    const { user } = req.body;
    console.log(`user is ${user}`);

    const result = await authRepository.findById(user);

    if (result == 0) {
        return res.status(401).json({message: 'Invalid user or password'});
    }
    
    let token = createJwtToken(user);
    res.status(200).json({userId:user, token});
}

export async function getStimulusInfo(req, res, next) {
    console.log(`called getStimulusInfo function`);
    let stimulusInfo = await dataRepository.getStimulusInfo();
    
    if (!stimulusInfo) {
        return res.status(401).json({message: 'Stimulus information is not found.'});
    }

    res.status(200).json({stimulusInfo});
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