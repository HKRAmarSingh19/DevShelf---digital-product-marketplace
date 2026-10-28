import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageAdapter } from './storage.interface.js';
import { env } from '../../config/env.js';

export class LocalStorageAdapter implements IStorageAdapter {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), env.STORAGE_LOCAL_DIR);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    // Prevent directory traversal
    const safeKey = key.replace(/\.\./g, '');
    return path.join(this.baseDir, safeKey);
  }

  async uploadFile(key: string, buffer: Buffer): Promise<string> {
    const fullPath = this.getFilePath(key);
    const parentDir = path.dirname(fullPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, buffer);
    return key;
  }

  async getSignedDownloadUrl(
    key: string,
    originalFilename: string,
    expiresInSeconds = 300
  ): Promise<string> {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const dataToSign = `${key}:${expiresAt}:${originalFilename}`;
    const signature = crypto
      .createHmac('sha256', env.SESSION_SECRET)
      .update(dataToSign)
      .digest('hex');

    const params = new URLSearchParams({
      key,
      expiresAt: expiresAt.toString(),
      filename: originalFilename,
      sig: signature,
    });

    return `${env.API_BASE_URL}/api/v1/uploads/download-file?${params.toString()}`;
  }

  async deleteFile(key: string): Promise<void> {
    const fullPath = this.getFilePath(key);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  async fileExists(key: string): Promise<boolean> {
    const fullPath = this.getFilePath(key);
    return fs.existsSync(fullPath);
  }

  verifyDownloadSignature(
    key: string,
    expiresAt: number,
    filename: string,
    providedSig: string
  ): boolean {
    if (Date.now() > expiresAt) {
      return false; // Expired
    }
    const dataToSign = `${key}:${expiresAt}:${filename}`;
    const expectedSig = crypto
      .createHmac('sha256', env.SESSION_SECRET)
      .update(dataToSign)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig));
  }

  getAbsoluteFilePath(key: string): string {
    return this.getFilePath(key);
  }
}
