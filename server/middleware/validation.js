import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// News validation rules
export const validateNews = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('summary')
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ max: 300 })
    .withMessage('Summary cannot be more than 300 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Politics', 'Business', 'Technology', 'Health', 'Entertainment', 'Sports', 'Science', 'World', 'Environment', 'Other'])
    .withMessage('Please select a valid category'),
  body('author')
    .notEmpty()
    .withMessage('Author name is required')
];

// User validation rules
export const validateUser = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];