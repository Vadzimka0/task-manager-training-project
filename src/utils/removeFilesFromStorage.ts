import { unlink } from 'fs/promises';

export async function removeFilesFromStorage(filesPaths: string[]): Promise<void> {
  filesPaths.forEach(async (filePath) => {
    try {
      await unlink(filePath);
    } catch (e) {}
  });
}
