import { Router } from 'express'; 
import { signupController, signinController } from './auth.controller';

const router = Router(); 

router.post('/register', signupController); 
router.post('/login', signinController);
export default router; 
