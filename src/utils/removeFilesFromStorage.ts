import { unlink } from 'fs/promises';

/**
 * A method that deletes files from the filesystem
 */
export async function removeFilesFromStorage(filesPaths: string[]): Promise<void> {
  filesPaths.forEach(async (filePath) => {
    try {
      await unlink(filePath);
    } catch (e) {}
  });
}
