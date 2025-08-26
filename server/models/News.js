import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    maxlength: [200, 'Summary cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Politics', 
      'Business', 
      'Technology', 
      'Health', 
      'Entertainment', 
      'Sports', 
      'Science', 
      'World',
      'Environment',
      'Other'
    ]
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  videoUrl: {
    type: String,
    default: null
  },
  audioUrl: {
    type: String,
    default: null
  },
  author: {
    type: String,
    required: [true, 'Please add an author name']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
NewsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('News', NewsSchema);