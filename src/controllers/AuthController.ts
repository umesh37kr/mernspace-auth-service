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
        await AppDataSource.initialize();

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        const userRepository = AppDataSource.getRepository(User);

        await userRepository.save(user);

        res.status(201).json({ success: 'data inserted...' });
    }
}
