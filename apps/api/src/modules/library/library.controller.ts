import { Request, Response, NextFunction } from 'express';
import { libraryService } from './library.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export class LibraryController {
  async getMyLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!._id.toString();
      const library = await libraryService.getMyLibrary(buyerId);
      return sendSuccess(res, library);
    } catch (error) {
      next(error);
    }
  }

  async getLibraryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!._id.toString();
      const { productId } = req.params;
      const item = await libraryService.getLibraryItem(buyerId, productId);
      return sendSuccess(res, item);
    } catch (error) {
      next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!._id.toString();
      const { productId } = req.params;
      const versionStr = req.query.version as string | undefined;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await libraryService.generateDownloadUrl(
        buyerId,
        productId,
        versionStr,
        ipAddress,
        userAgent
      );

      return sendSuccess(res, result, 'Download authorized');
    } catch (error) {
      next(error);
    }
  }
}

export const libraryController = new LibraryController();
