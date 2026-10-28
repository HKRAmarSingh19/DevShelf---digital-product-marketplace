import mongoose from 'mongoose';
import { EntitlementModel, DownloadEventModel } from '../entitlements/entitlement.model.js';
import { ProductModel } from '../products/product.model.js';
import { ProductVersionModel } from '../products/productVersion.model.js';
import { getStorageAdapter } from '../../integrations/storage/index.js';
import { AppError } from '../../common/errors/AppError.js';
import { ENTITLEMENT_STATUS } from '@devshelf/shared';

export class LibraryService {
  async getMyLibrary(buyerId: string) {
    const entitlements = await EntitlementModel.find({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      status: ENTITLEMENT_STATUS.ACTIVE,
    })
      .populate({
        path: 'productId',
        populate: [
          { path: 'sellerId', select: 'name avatarUrl bio' },
          { path: 'categoryId', select: 'name slug icon' },
        ],
      })
      .populate('orderId', 'orderNumber createdAt totalInPaise')
      .sort({ purchasedAt: -1 })
      .lean();

    return entitlements.map((e) => ({
      id: e._id.toString(),
      productId: (e.productId as any)?._id?.toString(),
      product: e.productId,
      orderId: (e.orderId as any)?._id?.toString(),
      orderNumber: (e.orderId as any)?.orderNumber,
      licenseType: e.licenseType,
      purchasedAt: e.purchasedAt,
      downloadCount: e.downloadCount,
      lastDownloadedAt: e.lastDownloadedAt,
    }));
  }

  async getLibraryItem(buyerId: string, productId: string) {
    const entitlement = await EntitlementModel.findOne({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: new mongoose.Types.ObjectId(productId),
      status: ENTITLEMENT_STATUS.ACTIVE,
    })
      .populate({
        path: 'productId',
        populate: [
          { path: 'sellerId', select: 'name avatarUrl bio' },
          { path: 'categoryId', select: 'name slug icon' },
        ],
      })
      .lean();

    if (!entitlement) {
      throw AppError.forbidden('You do not own an active entitlement for this product');
    }

    const versions = await ProductVersionModel.find({
      productId: new mongoose.Types.ObjectId(productId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      entitlement: {
        id: entitlement._id.toString(),
        licenseType: entitlement.licenseType,
        purchasedAt: entitlement.purchasedAt,
        downloadCount: entitlement.downloadCount,
        lastDownloadedAt: entitlement.lastDownloadedAt,
      },
      product: entitlement.productId,
      versions: versions.map((v) => ({
        id: v._id.toString(),
        version: v.version,
        changelog: v.changelog,
        originalFilename: v.originalFilename,
        fileSizeBytes: v.fileSizeBytes,
        createdAt: v.createdAt,
      })),
    };
  }

  async generateDownloadUrl(
    buyerId: string,
    productId: string,
    versionStr?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const entitlement = await EntitlementModel.findOne({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: new mongoose.Types.ObjectId(productId),
      status: ENTITLEMENT_STATUS.ACTIVE,
    });

    if (!entitlement) {
      throw AppError.forbidden('You do not have permission to download this digital product');
    }

    // Find version to download
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let versionDoc: any = null;
    if (versionStr) {
      versionDoc = await ProductVersionModel.findOne({
        productId: new mongoose.Types.ObjectId(productId),
        version: versionStr,
      });
    } else {
      // Latest version
      versionDoc = await ProductVersionModel.findOne({
        productId: new mongoose.Types.ObjectId(productId),
      }).sort({ createdAt: -1 });
    }

    if (!versionDoc) {
      throw AppError.notFound('No downloadable files found for this product version');
    }

    // Record download event
    await DownloadEventModel.create({
      entitlementId: entitlement._id,
      buyerId: entitlement.buyerId,
      productId: entitlement.productId,
      version: versionDoc.version,
      ipAddress,
      userAgent,
      downloadedAt: new Date(),
    });

    entitlement.downloadCount += 1;
    entitlement.lastDownloadedAt = new Date();
    await entitlement.save();

    // Generate signed URL (expires in 300 seconds / 5 minutes)
    const storage = getStorageAdapter();
    const signedUrl = await storage.getSignedDownloadUrl(
      versionDoc.storageKey,
      versionDoc.originalFilename,
      300
    );

    return {
      signedUrl,
      filename: versionDoc.originalFilename,
      version: versionDoc.version,
      fileSizeBytes: versionDoc.fileSizeBytes,
      expiresInSeconds: 300,
    };
  }
}

export const libraryService = new LibraryService();
