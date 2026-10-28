import mongoose, { Schema, Document } from 'mongoose';
import {
  USER_ROLES,
  SELLER_STATUS,
  USER_STATUS,
  UserRole,
  SellerStatus,
  UserStatus,
} from '@devshelf/shared';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  sellerStatus: SellerStatus;
  status: UserStatus;
  avatarUrl?: string;
  bio?: string;
  emailVerifiedAt?: Date;
  sellerApplication?: {
    bio?: string;
    portfolioUrl?: string;
    githubUrl?: string;
    categoriesInterested?: string[];
    appliedAt: Date;
    decisionAt?: Date;
    decisionNotes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      index: true,
    },
    sellerStatus: {
      type: String,
      enum: Object.values(SELLER_STATUS),
      default: SELLER_STATUS.NOT_APPLIED,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    emailVerifiedAt: { type: Date, default: null },
    sellerApplication: {
      bio: { type: String },
      portfolioUrl: { type: String },
      githubUrl: { type: String },
      categoriesInterested: [{ type: String }],
      appliedAt: { type: Date },
      decisionAt: { type: Date },
      decisionNotes: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
