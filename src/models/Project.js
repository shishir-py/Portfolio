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
  technologies: {
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
  githubUrl: {
    type: String,
  },
  featured: {
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

// Create and export the model
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 