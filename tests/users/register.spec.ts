import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
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
            // const userData = {
            //     firstName: 'Priti',
            //     lastName: 'Kumar',
            //     email: 'umesh@mern.space',
            //     password: 'secret',
            // };
            // // Act
            // await request(app).post('/auth/register').send(userData);
            // // Assert
            // const userRepository = connection.getRepository(User);
            // const users = await userRepository.find();
            // expect(users).toHaveLength(1);
            // expect(users[0].firstName).toBe(userData.firstName);
            // expect(users[0].lastName).toBe(userData.lastName);
            // expect(users[0].email).toBe(userData.email);
        });
    });
    describe('Fields are Missing', () => {});
});
