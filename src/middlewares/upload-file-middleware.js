// middlewares/fileUpload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Daftar mime types untuk berbagai tipe file
const mimeTypes = {
  image: /jpeg|jpg|png|webp/,
  document: /pdf|doc|docx|xls|xlsx|ppt|pptx/,
  all: /.*/ // jika ingin mengizinkan semua
};

function uploadFile(subfolder = '', type = 'image') {
  const fullPath = path.join(__dirname, '../public', subfolder);
  fs.mkdirSync(fullPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, fullPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = mimeTypes[type];
    if (!allowed) {
      return cb(new Error(`Unsupported type: ${type}`), false);
    }

    const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowed.test(file.mimetype);

    if (extValid && mimeValid) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${type} files are allowed.`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
}

export default uploadFile;
