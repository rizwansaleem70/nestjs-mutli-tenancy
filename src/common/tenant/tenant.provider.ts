// src/common/tenant/tenant.provider.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const TenantConnectionProvider = {
  provide: 'TENANT_CONNECTION',
  useFactory: async (tenantName: string, configService: ConfigService) => {
    const connectionOptions: DataSourceOptions = {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: tenantName,
      entities: [
        /* your entities */
      ],
      migrations: [
        /* migrations path */
      ],
      synchronize: false,
    };

    // Return the DataSource instance
    return new DataSource(connectionOptions);
  },
  inject: [ConfigService],
};
