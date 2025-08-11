import prisma  from '../../utils/prismaClient'; 
import { supabase } from '../supabaseServer';
import type { User } from '@prisma/client';

type SignupParams = {
  email: string
  password: string
  displayName: string
  firstName?: string
  lastName?: string
}




async function signupUser(params: SignupParams): Promise<User> { 
    
    const { email, password, displayName,  firstName, lastName } = params;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({ 
	email, 
	password, 
	email_confirm: true, 
    })

    if (authError) throw authError 

    const authUser = authData.user 

    return prisma.user.create({ 
	data: { 
	    id: authUser.id, 
	    email: authUser.email!, 
	    displayName, 
	    firstName, 
	    lastName,
	}, 
    })
}






async function signinUser(params: LoginParams) { 
    
    const { email, password } = params; 
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
	email, 
	password,
    })

}




