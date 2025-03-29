const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
      fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
      response: mongoose.Schema.Types.Mixed
    }],
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Response', responseSchema);