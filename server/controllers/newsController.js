import News from "../models/News.js";
import ApiError from "../utils/ApiError.js";
import {
  getPublicIdFromUrl,
  deleteFromCloudinary,
  processFileUploads,
} from "../utils/helpers.js";

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res, next) => {
  try {
    const {
      select,
      sort,
      page = 1,
      limit = 10,
      category,
      ...filters
    } = req.query;

    // Convert operators to MongoDB format ($gt, $gte, etc.)
    const mongoFilters = JSON.parse(
      JSON.stringify(filters).replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      )
    );

    // Add category filter if specified and not 'All'
    if (category && category !== "All") {
      mongoFilters.category = category;
    }

    // Base query
    let query = News.find(mongoFilters).populate("createdBy", "name email");

    // Select specific fields
    if (select) {
      const fields = select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort results
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // Default to latest first
    }

    // Pagination calculation
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await News.countDocuments(mongoFilters);

    query = query.skip(skip).limit(parseInt(limit));

    // Execute query
    const news = await query;

    // Pagination metadata
    const pagination = {};
    if (skip + parseInt(limit) < total) {
      pagination.next = { page: +page + 1, limit: +limit };
    }
    if (skip > 0) {
      pagination.prev = { page: +page - 1, limit: +limit };
    }

    // ✅ Get all news
    res.status(200).json({
      success: true,
      message: "News fetched successfully",
      count: news.length,
      pagination,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
export const getSingleNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!news) {
      return next(
        new ApiError(`News not found with id of ${req.params.id}`, 404)
      );
    }

    // ✅ Get single news
    res.status(200).json({
      success: true,
      message: "News fetched successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new news with file uploads
// @route   POST /api/news
// @access  Private/Admin
export const createNews = async (req, res, next) => {
  try {
    // Process file uploads
    let uploadResults = {};
    if (req.files) {
      uploadResults = await processFileUploads(req.files);
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Add file URLs to request body
    if (uploadResults.imageUrl) req.body.imageUrl = uploadResults.imageUrl;
    if (uploadResults.videoUrl) req.body.videoUrl = uploadResults.videoUrl;
    if (uploadResults.audioUrl) req.body.audioUrl = uploadResults.audioUrl;

    const news = await News.create(req.body);

    // ✅ Create news
    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news with optional file uploads
// @route   PUT /api/news/:id
// @access  Private/Admin
export const updateNews = async (req, res, next) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return next(
        new ApiError(`News not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is news owner or admin
    if (
      news.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ApiError(
          `User ${req.user.id} is not authorized to update this news`,
          401
        )
      );
    }

    // Process file uploads if any
    if (req.files) {
      const uploadResults = await processFileUploads(req.files);

      // Delete old files if new ones are uploaded
      if (uploadResults.imageUrl && news.imageUrl) {
        const oldImagePublicId = getPublicIdFromUrl(news.imageUrl);
        if (oldImagePublicId) await deleteFromCloudinary(oldImagePublicId);
        req.body.imageUrl = uploadResults.imageUrl;
      }

      if (uploadResults.videoUrl && news.videoUrl) {
        const oldVideoPublicId = getPublicIdFromUrl(news.videoUrl);
        if (oldVideoPublicId) await deleteFromCloudinary(oldVideoPublicId);
        req.body.videoUrl = uploadResults.videoUrl;
      }

      if (uploadResults.audioUrl && news.audioUrl) {
        const oldAudioPublicId = getPublicIdFromUrl(news.audioUrl);
        if (oldAudioPublicId) await deleteFromCloudinary(oldAudioPublicId);
        req.body.audioUrl = uploadResults.audioUrl;
      }
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // ✅ Update news
    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return next(
        new ApiError(`News not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is news owner or admin
    if (
      news.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ApiError(
          `User ${req.user.id} is not authorized to delete this news`,
          401
        )
      );
    }

    // Delete associated media files from Cloudinary
    if (news.imageUrl) {
      const imagePublicId = getPublicIdFromUrl(news.imageUrl);
      if (imagePublicId) await deleteFromCloudinary(imagePublicId);
    }

    if (news.videoUrl) {
      const videoPublicId = getPublicIdFromUrl(news.videoUrl);
      if (videoPublicId) await deleteFromCloudinary(videoPublicId);
    }

    if (news.audioUrl) {
      const audioPublicId = getPublicIdFromUrl(news.audioUrl);
      if (audioPublicId) await deleteFromCloudinary(audioPublicId);
    }

    await News.findByIdAndDelete(req.params.id);

    // ✅ Delete news
    res.status(200).json({
      success: true,
      message: "News deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload files for news
// @route   POST /api/news/upload
// @access  Private/Admin
export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ApiError("Please upload at least one file", 400));
    }

    const uploadResults = await processFileUploads(req.files);

    // ✅ Upload files
    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: uploadResults,
    });
  } catch (error) {
    next(error);
  }
};
