// src/modules/user/user.service.ts
import { Injectable, Inject, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../entities/user.entity';
import { TenantRequest } from '../tenant.middleware';

@Injectable({ scope: Scope.REQUEST }) // Ensure request-scoped dependency
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(@Inject(REQUEST) private readonly request: TenantRequest) {
    if (!this.request.tenantConnection) {
      throw new Error('Tenant connection not found in request');
    }

    this.userRepository = this.request.tenantConnection.getRepository(User);
  }

  async createUser(name: string, email: string) {
    const user = this.userRepository.create({ name, email });
    return await this.userRepository.save(user);
  }

  async getUsers() {
    return await this.userRepository.find();
  }
}
