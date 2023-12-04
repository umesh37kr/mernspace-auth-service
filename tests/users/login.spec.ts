import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';

describe('POST /auth/login', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('given all fields', () => {
        // it('should return 200 status code', async () => {
        //     // arrange
        //     const userData = {
        //         email: 'umesh@mernspace.com',
        //         password: 'secret',
        //     };
        //     // Act
        //     const response = await request(app)
        //         .post('/auth/login')
        //         .send(userData);
        //     // assert
        //     expect(response.statusCode).toBe(200);
        // });
    });

    describe('fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                email: '',
                password: 'password',
            };
            // Assert
            const response = await request(app)
                .post('/auth/login')
                .send(userData);

            // Act
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if password field is missing', async () => {
            // Arrange
            const userData = {
                email: 'umesh@mernspace.com',
                password: '',
            };
            // Assert
            const response = await request(app)
                .post('/auth/login')
                .send(userData);

            // Act
            expect(response.statusCode).toBe(400);
        });
    });

    describe('fields are not in proper format', () => {
        it('should return 400 if email is not a valid email', async () => {
            const userData = {
                // Arrange
                email: 'umesh@mernaspace',
                password: 'secret',
            };
            // Assert
            const response = await request(app)
                .post('/auth/login')
                .send(userData);
            // Act
            expect(response.statusCode).toBe(400);
        });
    });
});
