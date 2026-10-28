import { UserModel, IUserDocument } from '../users/user.model.js';
import { hashPassword, verifyPassword } from '../../common/utils/password.js';
import { AppError } from '../../common/errors/AppError.js';
import { USER_ROLES, SELLER_STATUS, USER_STATUS } from '@devshelf/shared';
import crypto from 'crypto';

export class AuthService {
  async register(data: { name: string; email: string; password: string }): Promise<IUserDocument> {
    const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw AppError.conflict('An account with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await UserModel.create({
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      passwordHash,
      role: USER_ROLES.USER,
      sellerStatus: SELLER_STATUS.NOT_APPLIED,
      status: USER_STATUS.ACTIVE,
    });

    return user;
  }

  async login(data: { email: string; password: string }): Promise<IUserDocument> {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw AppError.forbidden('Your account has been suspended by marketplace moderation');
    }

    const isMatch = await verifyPassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Do not reveal email existence to prevent user enumeration
      return 'If that email is registered, password reset instructions have been generated.';
    }
    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // In production, token hash is stored with TTL. For now we provide a deterministic simulated response
    return `Password reset token generated: ${resetToken}`;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token) {
      throw AppError.badRequest('Reset token is required');
    }
    // Simulating token verification and updating password
    const passwordHash = await hashPassword(newPassword);
    // Find active user if any or handle
  }

  sanitizeUser(user: IUserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      sellerStatus: user.sellerStatus,
      status: user.status,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
