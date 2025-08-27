// Simple in-memory metrics fallback if Redis is not available
const metrics = new Map();
const events = new Map();

let redis;
let useRedis = false;
let loggedMetricsStatus = false;

try {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL);
  
  redis.on('connect', () => {
    useRedis = true;
    console.log('✅ Metrics connected to Redis');
    loggedMetricsStatus = true;
  });
  
  redis.on('error', () => {
    useRedis = false;
    if (!loggedMetricsStatus) {
      console.log('⚠️  Metrics using in-memory storage');
      loggedMetricsStatus = true;
    }
  });
} catch (err) {
  console.log('⚠️  Metrics using in-memory storage');
  loggedMetricsStatus = true;
}

// Increment a simple counter
async function incr(key) {
  if (useRedis && redis) {
    try {
      return await redis.incr(key);
    } catch (err) {
      if (useRedis) {
        useRedis = false;
        if (!loggedMetricsStatus) {
          console.log('⚠️  Metrics Redis connection lost, using in-memory storage');
          loggedMetricsStatus = true;
        }
      }
    }
  }
  metrics.set(key, (metrics.get(key) || 0) + 1);
}

// Increment a hash field (e.g. language counts)
async function hincr(hash, field) {
  if (useRedis && redis) {
    try {
      return await redis.hincrby(hash, field, 1);
    } catch (err) {
      if (useRedis) {
        useRedis = false;
        if (!loggedMetricsStatus) {
          console.log('⚠️  Metrics Redis connection lost, using in-memory storage');
          loggedMetricsStatus = true;
        }
      }
    }
  }
  const hashMap = metrics.get(hash) || new Map();
  hashMap.set(field, (hashMap.get(field) || 0) + 1);
  metrics.set(hash, hashMap);
}

// Record a timestamped event in a sorted set
async function recordEvent(setKey) {
  if (useRedis && redis) {
    try {
      const ts = Date.now();
      return await redis.zadd(setKey, ts, ts);
    } catch (err) {
      if (useRedis) {
        useRedis = false;
        if (!loggedMetricsStatus) {
          console.log('⚠️  Metrics Redis connection lost, using in-memory storage');
          loggedMetricsStatus = true;
        }
      }
    }
  }
  const eventList = events.get(setKey) || [];
  eventList.push(Date.now());
  events.set(setKey, eventList);
}

module.exports = { incr, hincr, recordEvent };
