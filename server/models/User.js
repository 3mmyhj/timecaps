const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }); // timestamps: true will add createdAt and updatedAt fields automatically

// Pre-save hook for password hashing will be added later when implementing auth routes.

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
