import express from 'express';
import {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  uploadFiles
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateNews, handleValidationErrors } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .get(getNews)
  .post(protect, authorize('admin'), uploadMultiple, validateNews, handleValidationErrors, createNews);

router
  .route('/:id')
  .get(getSingleNews)
  .put(protect, authorize('admin'), uploadMultiple, validateNews, handleValidationErrors, updateNews)
  .delete(protect, authorize('admin'), deleteNews);

// Separate upload endpoint for when files need to be uploaded separately
router.post('/upload/files', protect, authorize('admin'), uploadMultiple, uploadFiles);

export default router;