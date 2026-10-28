export interface IStorageAdapter {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  getSignedDownloadUrl(
    key: string,
    originalFilename: string,
    expiresInSeconds?: number
  ): Promise<string>;
  deleteFile(key: string): Promise<void>;
  fileExists(key: string): Promise<boolean>;
}
