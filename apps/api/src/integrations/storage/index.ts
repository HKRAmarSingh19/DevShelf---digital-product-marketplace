import { IStorageAdapter } from './storage.interface.js';
import { LocalStorageAdapter } from './localStorage.adapter.js';

let storageInstance: IStorageAdapter | null = null;

export function getStorageAdapter(): IStorageAdapter {
  if (!storageInstance) {
    // We default to the LocalStorageAdapter for hermetic, credential-free execution
    // S3/R2 adapter can be swapped when S3 credentials are provided
    storageInstance = new LocalStorageAdapter();
  }
  return storageInstance;
}

export * from './storage.interface.js';
export * from './localStorage.adapter.js';
