import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // T009, T010: Register new user (role = usuario)
  @Post()
  async createUser(@Body() body: { email: string }) {
    return this.profileService.createUser(body.email);
  }

  // T009: Get profile by id
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }

  // T020: Superadmin: list all users
  @Get()
  async getAllUsers() {
    return this.profileService.getAllUsers();
  }

  // T022, T028: Deactivate user (superadmin)
  @Put(':id/deactivate')
  async deactivateUser(
    @Param('id') id: string,
    @Body() body: { actorRole: RoleEnum; actorId: string },
  ) {
    return this.profileService.deactivateUser(id, body.actorRole, body.actorId);
  }
}
