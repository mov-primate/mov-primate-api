import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository.js';
import { RoleEnum } from '../../../common/enums/index.js';
import { DuplicateUserException } from '../../../common/exceptions/business.exceptions.js';
import { RoleChangeUnauthorizedException, UnauthorizedException } from '../../../common/exceptions/auth.exceptions.js';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  // T010: New user starts as 'usuario' (not alumno)
  async createUser(email: string): Promise<any> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new DuplicateUserException();
    const user = await this.userRepository.create(email);
    return { id: user._id, email: user.email, role: user.role, isActive: user.isActive };
  }

  // T009: Get profile
  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return { id: user._id, email: user.email, role: user.role, isActive: user.isActive };
  }

  // T020: All users (superadmin overview)
  async getAllUsers(): Promise<any[]> {
    const users = await this.userRepository.findAll();
    return users.map(u => ({ id: u._id, email: u.email, role: u.role, isActive: u.isActive }));
  }

  // T022: Deactivate user (superadmin only)
  async deactivateUser(userId: string, actorRole: RoleEnum, actorId: string): Promise<any> {
    if (actorRole !== RoleEnum.SUPERADMIN) throw new UnauthorizedException('Solo el superadmin puede desactivar usuarios');
    const user = await this.userRepository.deactivate(userId, actorId);
    return { id: user?._id, isActive: user?.isActive };
  }
}
