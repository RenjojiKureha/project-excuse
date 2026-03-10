import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { PresetModel } from './models/preset.model';
import presets from './data/presets.json';

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    // 初始化预设数据
    const presetCount = await PresetModel.countDocuments();
    if (presetCount === 0) {
      await PresetModel.insertMany(presets.map((p) => ({ ...p, enabled: true })));
      console.log('Preset data seeded');
    }

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
