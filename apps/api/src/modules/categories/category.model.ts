import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Code' },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', CategorySchema);
