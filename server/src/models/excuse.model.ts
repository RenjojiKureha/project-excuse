import mongoose, { Schema, Document } from 'mongoose';

export interface IExcuseResult {
  excuseId: string;
  style: string;
  content: string;
  tip: string;
  liked: boolean | null;
}

export interface IExcuse extends Document {
  requestId: string;
  sessionId: string;
  input: {
    content: string;
    context: {
      myRole?: string;
      targetRole?: string;
      closeness?: number;
      targetCount?: string;
      time?: string;
      place?: string;
      channel?: string;
      tone?: string;
      extra?: string;
    };
  };
  results: IExcuseResult[];
  promptTokens: number;
  completionTokens: number;
  createdAt: Date;
}

const excuseResultSchema = new Schema<IExcuseResult>({
  excuseId: { type: String, required: true },
  style: { type: String, required: true },
  content: { type: String, required: true },
  tip: { type: String, default: '' },
  liked: { type: Schema.Types.Mixed, default: null },
}, { _id: false });

const excuseSchema = new Schema<IExcuse>({
  requestId: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true, index: true },
  input: {
    content: { type: String, required: true },
    context: {
      myRole: String,
      targetRole: String,
      closeness: Number,
      targetCount: String,
      time: String,
      place: String,
      channel: String,
      tone: String,
      extra: String,
    },
  },
  results: [excuseResultSchema],
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
}, { timestamps: true });

excuseSchema.index({ sessionId: 1, createdAt: -1 });

export const ExcuseModel = mongoose.model<IExcuse>('Excuse', excuseSchema);
