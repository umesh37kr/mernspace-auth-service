import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenant';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('POST tenants/create', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });
    });

    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });
    describe('all fields given', () => {
        it('should return 201 status code', async () => {
            const tenantsData = {
                name: 'Tenants name',
                address: 'tenants address',
            };

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantsData);
            expect(response.statusCode).toBe(201);
        });

        it('should create a tenants in the database', async () => {
            const tenantsData = {
                name: 'Tenants name',
                address: 'tenants address',
            };

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantsData);
            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantsData.name);
            expect(tenants[0].address).toBe(tenantsData.address);
        });

        it('should return 401 if user is not authenticated', async () => {
            const tenantsData = {
                name: 'Tenants name',
                address: 'tenants address',
            };

            const response = await request(app)
                .post('/tenants')
                .send(tenantsData);
            expect(response.statusCode).toBe(401);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();
            expect(tenants).toHaveLength(0);
        });
    });
});
