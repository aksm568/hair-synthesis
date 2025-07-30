const mongoose = require('mongoose');

const synthesisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalImage: {
    type: String,
    required: true
  },
  hairStyle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HairStyle',
    required: true
  },
  synthesizedImage: {
    type: String,
    required: true
  },
  adjustments: {
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    scale: {
      x: { type: Number, default: 1 },
      y: { type: Number, default: 1 }
    },
    rotation: { type: Number, default: 0 },
    opacity: { type: Number, default: 1 }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Synthesis', synthesisSchema); 