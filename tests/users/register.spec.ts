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

        it('it should return an id of created user', async () => {
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
            expect(response.body).toHaveProperty('id');
            const repository = connection.getRepository(User);
            const users = await repository.find();
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });
        it('shoulda a customer role', async () => {
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

        it('should store the hashed password in the database', async () => {
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
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return 400 staus if email is already exist', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umesh@mernspace.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });
            // act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const users = await userRepository.find();
            // assert
            expect(response.status).toBe(400);
            expect(users).toHaveLength(1);
            expect;
        });
    });
    describe('Fields are Missing', () => {
        it('should return 400 statu code if email is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: '',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.status).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it('should return 400 status code if firstName is missing', async () => {
            // Arrange
            const userData = {
                firstName: '',
                lastName: 'kumar',
                email: 'umesh@mernspace.com',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 status code if lastName is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: '',
                email: 'umesh@mernspace.com',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 status code if password is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umesh@mernspace.com',
                password: '',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
    });
    describe('fields are not in proper format', () => {
        it('should the trim email field', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: ' umesh@mernspace.com ',
                password: 'secret',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            // Assert
            expect(user.email).toBe('umesh@mernspace.com');
        });
        it('should return 400 status code if email is not a valid email', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umesh.kumar',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
        it.skip('should return 400 status code if password length is less than 8 chars', async () => {
            // Arrange
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umesh@merspace.com',
                password: 'pass',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
        it('should return an array of error message if email is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: '',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty('errors');
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
    });
});
