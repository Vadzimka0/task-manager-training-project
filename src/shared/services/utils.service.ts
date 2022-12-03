import { Injectable } from '@nestjs/common';
import { access, unlink } from 'fs/promises';

@Injectable()
export class UtilsService {
  /**
   * A method that deletes files from the filesystem
   */
  async removeFilesFromStorage(filesPaths: string[]): Promise<void> {
    filesPaths.forEach(async (filePath) => {
      try {
        await unlink(filePath);
      } catch (e) {}
    });
  }

  /**
   * A method that checks if the file exists
   */
  async isExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * A method that compare two arrays where the order of the elements in each array is not important
   */
  haveSameItems(arr1: string[], arr2: string[]): boolean {
    if (!arr1) arr1 = [];
    if (!arr2) arr2 = [];

    if (arr1.length !== arr2.length) return false;

    const uniqueValues = new Set([...arr1, ...arr2]);

    for (const value of uniqueValues) {
      const arr1Count = arr1.filter((e) => e === value).length;
      const arr2Count = arr2.filter((e) => e === value).length;
      if (arr1Count !== arr2Count) return false;
    }

    return true;
  }
}
