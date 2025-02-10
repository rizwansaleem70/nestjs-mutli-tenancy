// src/tenant/tenant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource, // Master DB connection
  ) {}

  /**
   * Creates a new tenant and sets up its database.
   */
  async createTenant(tenantName: string) {
    const dbName = 'tenant_' + tenantName;
    // Step 1: Save the tenant record in the master database
    const tenant = await this.tenantRepository.save({
      name: tenantName,
      database: dbName,
    });

    // Step 2: Create the database for the tenant
    await this.createTenantDatabase(dbName);
    return tenant;
  }

  /**
   * Creates a new database for the tenant dynamically.
   */
  private async createTenantDatabase(tenantName: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Create database if it doesn't exist
    await queryRunner.query(`CREATE DATABASE IF NOT EXISTS \`${tenantName}\`;`);

    await queryRunner.release();
  }
}
