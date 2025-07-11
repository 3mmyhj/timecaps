const mongoose = require('mongoose');
const { Schema } = mongoose;

const EntrySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Changed 'content' to 'description' to match user's initial request
  imageUrl: { type: String },
  // imageHint: { type: String }, // Removing imageHint as it wasn't in the user's initial confirmed list
  unlockDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// The pattern `mongoose.models.Entry || mongoose.model('Entry', EntrySchema)` is good for preventing
// model re-compilation issues, especially in environments like Next.js.
// For a standard Express app, `mongoose.model('Entry', EntrySchema)` is often sufficient if models are imported consistently.
// However, using the more robust pattern doesn't hurt.
module.exports = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
