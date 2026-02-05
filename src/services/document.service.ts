import { ContainerClient } from '@azure/storage-blob';

const sasUrl = 'https://financenwr.blob.core.windows.net/financedocs?sp=racwdl&st=2026-02-04T20:16:34Z&se=2027-01-01T04:31:34Z&spr=https&sv=2024-11-04&sr=c&sig=1nWc1jjFSnhEHUEsBWQZ4%2FcVwG4cnncUPgx7N8dxpm4%3D';

export async function uploadDocument(doc: string, file: File): Promise<string> {
  try {
    const containerClient = new ContainerClient(sasUrl);
    const extension = file.name.split('.').pop() || 'bin';
    const blobName = `${doc.replace(/\s+/g, '_')}_${Date.now()}.${extension}`;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.upload(file, file.size);
    return blobClient.url;
  } catch (error) {
    console.error('Upload failed in service', error);
    throw error;
  }
}

export async function getDocumentUrl(doc: string): Promise<string | null> {
  // This could be implemented if needed, but for now, since URLs are stored in state, perhaps not necessary
  // If you want to fetch from storage, you can list blobs or something, but for simplicity, return null or implement later
  return null;
}