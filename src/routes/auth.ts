import { Router } from 'express';
import { register } from '../controllers/auth';

const authRoutes: Router = Router();

authRoutes.post('/register', register);

export default authRoutes;
