import mongoose from 'mongoose';
import crypto from 'crypto';

// Define the admin schema
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  // We'll store the hashed password, not the actual password
  hashedPassword: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  salt: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to set password - this will create a salt and hash the password
AdminSchema.methods.setPassword = function(password) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex');
  
  // Hashing user's salt and password with 1000 iterations
  this.hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to validate password
AdminSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  
  return this.hashedPassword === hash;
};

// Create and export the model
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema); 