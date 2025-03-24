import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  author: {
    type: String,
    default: 'Tara Prasad Pandey'
  },
  category: {
    type: String,
    default: 'Data Analysis'
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  addToHome: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  imageColor: {
    type: String,
    default: 'bg-blue-700'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ featured: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog; 