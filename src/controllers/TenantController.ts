import { NextFunction, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { createTenantData } from '../types';
import { Logger } from 'winston';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: createTenantData, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug('Request for creating a tenant', req.body);
        try {
            const tenants = await this.tenantService.create({ name, address });
            this.logger.info('Tenant has been created', { id: tenants.id });
            res.status(201).json({ id: tenants.id });
        } catch (error) {
            next(error);
        }
    }
}
