import mongoose from 'mongoose';

// Define the blog post schema
const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
    default: 'Tara Pandey',
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
  },
  imageUrl: {
    type: String,
  },
  imageColor: {
    type: String,
    default: 'bg-blue-700',
  },
  readTime: {
    type: String,
    default: '5 min',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema); 