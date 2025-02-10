// src/modules/user/user.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body('name') name: string, @Body('email') email: string) {
    return await this.userService.createUser(name, email);
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
