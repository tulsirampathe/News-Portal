import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';

// Set storage engine
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
const filetypes = /jpeg|jpg|png|gif|webp|bmp|svg|tiff|ico|heic|mp4|mov|avi|mkv|webm|flv|wmv|3gp|mp3|wav|aac|ogg|m4a|flac/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError('Error: Images, Videos and Audio files only!'), false);
  }
}

// Init upload for multiple files
export const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'imageUrl', maxCount: 1 },
  { name: 'videoUrl', maxCount: 1 },
  { name: 'audioUrl', maxCount: 1 }
]);

// Init upload for single file
export const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});