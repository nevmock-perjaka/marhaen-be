import multer, { MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
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

function generateRandomFilename(originalname) {
  const ext = path.extname(originalname);
  const randomStr = crypto.randomBytes(16).toString('hex');
  return `${randomStr}${ext}`;
}

function uploadFile(subfolder = '', type = 'image') {
  const fullPath = path.join(__dirname, '../../public', subfolder);
  fs.mkdirSync(fullPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath)
    },

    filename: (req, file, cb) => {
      const filename = generateRandomFilename(file.originalname);
      cb(null, filename);
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
      cb(new MulterError(400, `Only ${type} files are allowed.`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
}

export default uploadFile;
