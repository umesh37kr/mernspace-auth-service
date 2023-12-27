import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password, role }: UserData) {
        // check emaill is already exist
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const err = createHttpError(400, 'Email is already exists!');
            throw err;
        }
        // hashed password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store data into database',
            );
            throw error;
        }
    }
    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
