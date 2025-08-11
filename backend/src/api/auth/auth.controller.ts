import { signupUser } from './auth.services';
import { Request, Response } from 'express';
import { isSupabaseAuthError } from '@/types/error.types';

export async function signupController(req: Request, res: Response) { 
    
    try { 

    const { email, password, displayName, ...options } = req.body; 

    if (!email || !password || !displayName) { 
	return res.status(400).json({
	    error: 'Missing required fields', 
	}); 
    } 

    if (password.length < 6) { 
	return res.status(400).json({
	    error: 'Password must be at least 6 characters long', 
	});
    } 

    const { user, session } = await signupUser({ 
	email, 
	password, 
	displayName,
	...options,
    })


    res.status(201).json({
	message: 'User created successfully.',
	user, 
	session,
    });

    } catch(error: unknown) {
	if (isSupabaseAuthError(error) && error.message.includes('User already registered')) { 

	    return res.status(409).json({
		error: 'A user with this email already exists.'
	    });
	}

	console.error('Sign up error:', error); 
	res.status(500).json({
	    error: 'Internal server error during signup',
	});
    }
};


