import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/users/user.model.js';
import { hashPassword } from '../common/utils/password.js';
import { logger } from '../config/logger.js';
import { USER_ROLES, SELLER_STATUS, USER_STATUS } from '@devshelf/shared';

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@devshelf.io';
  const password = process.env.ADMIN_PASSWORD || 'DevshelfAdminSecure2026!';
  const name = process.env.ADMIN_NAME || 'Platform Administrator';

  try {
    await connectDatabase();
    logger.info(`Checking administrator account for: ${email}`);

    let admin = await UserModel.findOne({ email: email.toLowerCase() });
    if (admin) {
      admin.role = USER_ROLES.ADMIN;
      admin.status = USER_STATUS.ACTIVE;
      admin.sellerStatus = SELLER_STATUS.APPROVED;
      admin.passwordHash = await hashPassword(password);
      await admin.save();
      logger.info(`Existing account updated to ADMIN: ${email}`);
    } else {
      admin = await UserModel.create({
        name,
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
        role: USER_ROLES.ADMIN,
        sellerStatus: SELLER_STATUS.APPROVED,
        status: USER_STATUS.ACTIVE,
      });
      logger.info(`Admin account created successfully: ${email}`);
    }

    logger.info(`Admin Provisioned. Credentials:`);
    logger.info(`Email: ${email}`);
    logger.info(`Password: ${password}`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Failed to provision admin account');
    process.exit(1);
  }
}

createAdmin();
