import mongoose from 'mongoose';

// Define the profile schema
const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    default: 'Tara Prasad Pandey',
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    default: 'Data Analyst',
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    default: 'sheahead22@gmail.com',
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567',
  },
  linkedin: {
    type: String,
    default: 'https://www.linkedin.com/in/Brainwave1999',
  },
  bio: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '/images/profile/admin-profile.jpg',
  },
  skills: {
    type: [String],
    default: [],
  },
  experiences: {
    type: [Object],
    default: [],
  },
  education: {
    type: [Object],
    default: [],
  },
  certifications: {
    type: [Object],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Since we'll have just one profile, we can use a singleton approach
export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema); 