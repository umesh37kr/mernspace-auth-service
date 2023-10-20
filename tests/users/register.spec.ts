import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { DataSource } from 'typeorm';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // truncate database
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            // Arrange
            const userData = {
                firstName: 'Umesh',
                lastName: 'Kumar',
                email: 'umesh@mern.space',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'Umesh',
                lastName: 'Kumar',
                email: 'umesh@mern.space',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should persist the user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Umesh',
                lastName: 'Kumar',
                email: 'umesh@mern.space',
                password: 'secret',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        // it('it should return an id of created user', async () => {
        //     // Arrange
        //     const userData = {
        //         firstName: 'Umesh',
        //         lastName: 'Kumar',
        //         email: 'umesh@mern.space',
        //         password: 'secret',
        //     };
        //     // Act
        //     await request(app).post('/auth/register').send(userData);
        //     // Assert
        //     const userRepository = connection.getRepository(User);
        //     const users = await userRepository.find();
        //     expect(users[0].id).toBeTruthy();
        // });
        it('role should be customer', async () => {
            // Arrange
            const userData = {
                firstName: 'Umesh',
                lastName: 'Kumar',
                email: 'umesh@mernspace.com',
                password: 'secret',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            // assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
    });
    describe('Fields are Missing', () => {});
});
