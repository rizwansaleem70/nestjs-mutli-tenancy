// src/common/tenant/tenant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';

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

    // Step 3: Run migrations for the new tenant database
    const tenantConnection = await this.createTenantConnection(dbName);
    await tenantConnection.initialize();
    await tenantConnection.runMigrations();

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

  /**
   * Creates a dynamic connection for a specific tenant database.
   */
  private async createTenantConnection(
    tenantName: string,
  ): Promise<DataSource> {
    return new DataSource({
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: tenantName, // Use the dynamically created tenant database
      entities: [User],
      migrations: [
        /* migrations path */
      ],
      synchronize: false, // Don't auto-sync, handle via migrations
    });
  }
}
