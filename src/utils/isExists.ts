import { access } from 'fs/promises';

/**
 * A method that checks if the file exists
 */
export async function isExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
