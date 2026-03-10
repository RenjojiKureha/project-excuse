import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  sessionId: string;
  excuseId: string;
  requestId: string;
  style: string;
  content: string;
  tip: string;
  originalInput: string;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  sessionId: { type: String, required: true },
  excuseId: { type: String, required: true },
  requestId: { type: String, required: true },
  style: { type: String, required: true },
  content: { type: String, required: true },
  tip: { type: String, default: '' },
  originalInput: { type: String, default: '' },
}, { timestamps: true });

favoriteSchema.index({ sessionId: 1, createdAt: -1 });
favoriteSchema.index({ sessionId: 1, excuseId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);
