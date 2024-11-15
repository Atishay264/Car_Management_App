import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

const initializeStorage = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

initializeStorage();

export const uploadToStorage = async (file: Express.Multer.File): Promise<string> => {
  const extension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.writeFile(filePath, file.buffer);

  // Return the URL that can be used to access the file
  return `/uploads/${fileName}`;
};

export const deleteFromStorage = async (fileUrl: string): Promise<void> => {
  if (!fileUrl) return;

  const fileName = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_DIR, fileName);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};