// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

module.exports = mongoose.model('User', userSchema);