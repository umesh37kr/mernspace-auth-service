import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /users', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });
    describe('given all fields', () => {
        it('should persist the user in the database', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });
            // register
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umeshkumar@mernspace.com',
                password: 'secretpassword',
                tenantId: 1,
            };

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it('should create a manager user', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });
            // register
            const userData = {
                firstName: 'umesh',
                lastName: 'kumar',
                email: 'umeshkumar@mernspace.com',
                password: 'secretpassword',
                tenantId: 1,
            };

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it.todo('should return 403 if non admin tries to create a user');
    });
});