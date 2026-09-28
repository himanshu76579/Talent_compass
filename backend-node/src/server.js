import mongoose from 'mongoose';
import { createApp } from './app.js';
import { startReminders } from './reminders.js';
const app = createApp({ jwtSecret: process.env.JWT_SECRET, origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()),
  ollamaUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434', ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2' });
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillpath', { serverSelectionTimeoutMS: 10000 });
await Promise.all(Object.values(mongoose.models).map(model => model.init()));
const stopReminders = startReminders(process.env);
const server = app.listen(Number(process.env.PORT || 8080), () => console.log('SkillPath backend listening'));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  stopReminders(); server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
});
