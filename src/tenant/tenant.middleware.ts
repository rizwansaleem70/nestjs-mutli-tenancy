// src/middleware/tenant.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';

export interface TenantRequest extends Request {
  tenantConnection?: DataSource;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    const tenantName = req.headers['x-tenant-id'] as string;

    if (!tenantName) {
      throw new BadRequestException(
        'Tenant ID is required in x-tenant-id header',
      );
    }

    try {
      const tenantDatabaseName = 'tenant_' + tenantName;
      // Create a new tenant-specific database connection
      const tenantConnection = new DataSource({
        type: 'mysql',
        host: this.configService.get<string>('DB_HOST'),
        port: Number(this.configService.get<number>('DB_PORT')),
        username: this.configService.get<string>('DB_USERNAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: tenantDatabaseName, // Use the tenant database
        entities: [User],
        synchronize: false,
      });

      await tenantConnection.initialize(); // Connect to the tenant DB

      req.tenantConnection = tenantConnection; // Attach to request object

      next(); // Continue to the next middleware/controller
    } catch (error) {
      console.error(`Error connecting to tenant database: ${error.message}`);
      throw new BadRequestException('Could not connect to tenant database');
    }
  }
}
