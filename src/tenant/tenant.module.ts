import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Tenant]), UserModule],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
