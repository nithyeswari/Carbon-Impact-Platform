import mongoose from 'mongoose';
import Redis from 'redis';

export const initDatabase = async () => {
  // MongoDB connection
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/carbon-impact');
  
  // Redis connection
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  await redisClient.connect();

  return { mongoose, redis: redisClient };
};

# packages/backend/src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  status: {
    type: String,
    enum: ['online', 'offline', 'nearby'],
    default: 'offline'
  },
  lastSeen: Date,
  metrics: {
    carbon: Number,
    water: Number
  }
});

export const User = mongoose.model('User', userSchema);