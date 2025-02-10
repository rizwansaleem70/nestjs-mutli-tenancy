import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantModule } from './common/tenant/tenant.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE') || 'mysql', // Default to MySQL
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'), // Master DB
        entities: [Tenant], // Register master database entities
        synchronize: false, // Keep migrations for production safety
        autoLoadEntities: true,
      }),
    }),
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(TenantMiddleware)
  //     .exclude(
  //       { path: 'tenants', method: RequestMethod.ALL }, // Exclude all routes inside TenantModule
  //       { path: 'tenants/(.*)', method: RequestMethod.ALL }, // Exclude subroutes
  //     )
  //     .forRoutes('*'); // Apply middleware to all other routes
  // }
}
