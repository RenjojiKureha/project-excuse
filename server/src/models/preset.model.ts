import mongoose, { Schema, Document } from 'mongoose';

export interface IPreset extends Document {
  name: string;
  icon: string;
  content: string;
  defaultContext: Record<string, string>;
  sortOrder: number;
  enabled: boolean;
}

const presetSchema = new Schema<IPreset>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  content: { type: String, required: true },
  defaultContext: { type: Schema.Types.Mixed, default: {} },
  sortOrder: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
});

presetSchema.index({ enabled: 1, sortOrder: 1 });

export const PresetModel = mongoose.model<IPreset>('Preset', presetSchema);
