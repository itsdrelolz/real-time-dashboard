import { User } from '@prisma/client'; 
import prisma  from '../../utils/prismaClient';
import bcrypt from "bcryptjs";


async function findUser(id: number): Promise<User | null> { 

    const user = await prisma.user.findUnique({ 
	where: { id }, 
    });

    if (!user) {
	throw new Error('User not found'); 
    } 
    return user 
}

async function createUser(email: string, password: string, firstName: string, lastName: string, displayName: string): Promise<User> { 
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({ 
	data: { 
	    email, 
	    // hash password
	    password: hashedPassword,
	    firstName, 
	    lastName, 
	    displayName
	}
    });

    const { password: _, ...userWithoutPassword } = user;

    return { 
	user: userWithoutPassword, 
	token, 
    };					
}
