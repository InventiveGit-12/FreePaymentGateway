import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minLength: 3
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
    default: 18
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'moderator'],
    default: ['user']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  meta: {
    lastLogin: Date
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
