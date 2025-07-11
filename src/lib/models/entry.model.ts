import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IEntry extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  unlockDate: Date;
  createdAt: Date;
  userId: mongoose.Schema.Types.ObjectId;
}

const EntrySchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  imageHint: { type: String },
  unlockDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Entry = models.Entry || model<IEntry>('Entry', EntrySchema);
export default Entry;
