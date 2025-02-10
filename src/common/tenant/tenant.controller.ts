// src/common/tenant/tenant.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenant(@Body('name') tenantName: string) {
    const tenant = await this.tenantService.createTenant(tenantName);
    return { message: 'Tenant created successfully', tenant };
  }
}
