import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface RegisterUserData extends Request {
    body: UserData;
}
export class AuthController {
    async register(req: RegisterUserData, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        await userRepository.save({ firstName, lastName, email, password });

        res.status(201).json({ success: 'data inserted...' });
    }
}
