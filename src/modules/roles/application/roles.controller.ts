import { Controller, Put, Get, Param, Body } from '@nestjs/common';
import { Types } from 'mongoose';
import { RolesService } from './roles.service.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // T021, T022, T023: Change role (superadmin only)
  @Put(':userId')
  async changeRole(
    @Param('userId') userId: string,
    @Body() body: { newRole: RoleEnum; actorRole: RoleEnum; actorId: string; reason?: string },
  ) {
    return this.rolesService.changeRole(userId, body.newRole, body.actorRole, new Types.ObjectId(body.actorId), body.reason);
  }

  // T023: Role change history for user
  @Get(':userId/history')
  async getRoleHistory(@Param('userId') userId: string) {
    return this.rolesService.getRoleHistory(userId);
  }

  // T020: All role changes (superadmin)
  @Get()
  async getAllRoleChanges() {
    return this.rolesService.getAllRoleChanges();
  }
}
