import mongoose from 'mongoose';

// Define the project schema
const ProjectSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  detailedDescription: {
    type: String,
  },
  details: {
    type: String,
  },
  content: {
    type: String,
  },
  technologies: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
  },
  imageColor: {
    type: String,
    default: 'bg-blue-700',
  },
  demoUrl: {
    type: String,
  },
  repoUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  addToHome: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'Data Analysis',
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

// Create and export the model with explicit collection name
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema, 'projects'); 