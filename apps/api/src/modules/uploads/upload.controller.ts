import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { getStorageAdapter, LocalStorageAdapter } from '../../integrations/storage/index.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/AppError.js';

// Multer memory storage configuration (up to 100MB for digital assets)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max
  },
});

export const uploadMiddleware = upload.single('file');

export class UploadController {
  async uploadProductFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw AppError.badRequest('No file uploaded');
      }

      const storage = getStorageAdapter();
      const ext = path.extname(req.file.originalname).toLowerCase();
      const randomPrefix = crypto.randomBytes(12).toString('hex');
      const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageKey = `products/assets/${randomPrefix}/${safeFilename}`;

      await storage.uploadFile(storageKey, req.file.buffer, req.file.mimetype);

      return sendSuccess(
        res,
        {
          storageKey,
          originalFilename: req.file.originalname,
          fileSizeBytes: req.file.size,
          mimeType: req.file.mimetype,
        },
        'File uploaded securely to private storage',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async uploadPreview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw AppError.badRequest('No preview image uploaded');
      }

      const storage = getStorageAdapter();
      const randomPrefix = crypto.randomBytes(8).toString('hex');
      const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageKey = `previews/${randomPrefix}/${safeFilename}`;

      await storage.uploadFile(storageKey, req.file.buffer, req.file.mimetype);

      // In local mode, serve preview directly
      const previewUrl = `/api/v1/uploads/raw-preview/${storageKey}`;

      return sendSuccess(res, { url: previewUrl }, 'Preview image uploaded', 201);
    } catch (error) {
      next(error);
    }
  }

  async serveRawPreview(req: Request, res: Response, next: NextFunction) {
    try {
      const key = (req.params as any)[0];
      const storage = getStorageAdapter() as LocalStorageAdapter;
      if (!storage.getAbsoluteFilePath) {
        throw AppError.notFound('Not found');
      }
      const fullPath = storage.getAbsoluteFilePath(`previews/${key}`);
      if (!fs.existsSync(fullPath)) {
        throw AppError.notFound('Preview image not found');
      }
      return res.sendFile(fullPath);
    } catch (error) {
      next(error);
    }
  }

  async downloadSignedFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, expiresAt, filename, sig } = req.query as {
        key: string;
        expiresAt: string;
        filename: string;
        sig: string;
      };

      if (!key || !expiresAt || !filename || !sig) {
        throw AppError.badRequest('Missing required download parameters');
      }

      const storage = getStorageAdapter() as LocalStorageAdapter;
      const isValid = storage.verifyDownloadSignature(
        key,
        Number(expiresAt),
        filename,
        sig
      );

      if (!isValid) {
        throw AppError.forbidden('Download link is invalid or has expired');
      }

      const fullPath = storage.getAbsoluteFilePath(key);
      if (!fs.existsSync(fullPath)) {
        throw AppError.notFound('Requested file does not exist on storage server');
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.sendFile(fullPath);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
