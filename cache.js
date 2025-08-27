// Simple in-memory cache fallback if Redis is not available
const cache = new Map();

let redis;
let useRedis = false;

try {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL);
  
  redis.on('connect', () => {
    useRedis = true;
    console.log('Connected to Redis');
  });
  
  redis.on('error', () => {
    useRedis = false;
    console.log('Redis unavailable, using in-memory cache');
  });
} catch (err) {
  console.log('Redis not configured, using in-memory cache');
}

module.exports = {
  async get(key) {
    if (useRedis && redis) {
      try {
        return await redis.get(key);
      } catch (err) {
        useRedis = false;
      }
    }
    return cache.get(key) || null;
  },
  async set(key, value, ttlSeconds = 86400) {
    if (useRedis && redis) {
      try {
        return await redis.set(key, value, 'EX', ttlSeconds);
      } catch (err) {
        useRedis = false;
      }
    }
    cache.set(key, value);
    // Simple TTL simulation
    setTimeout(() => cache.delete(key), ttlSeconds * 1000);
    return 'OK';
  }
};
