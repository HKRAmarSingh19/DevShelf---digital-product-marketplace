import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVersionDocument extends Document {
  productId: mongoose.Types.ObjectId;
  version: string;
  changelog: string;
  storageKey: string;
  originalFilename: string;
  fileSizeBytes: number;
  checksum?: string;
  createdAt: Date;
}

const ProductVersionSchema = new Schema<IProductVersionDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    version: { type: String, required: true },
    changelog: { type: String, required: true },
    storageKey: { type: String, required: true },
    originalFilename: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    checksum: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound unique index so product cannot have duplicate versions
ProductVersionSchema.index({ productId: 1, version: 1 }, { unique: true });

export const ProductVersionModel = mongoose.model<IProductVersionDocument>(
  'ProductVersion',
  ProductVersionSchema
);
