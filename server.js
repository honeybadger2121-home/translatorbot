require('dotenv').config();
const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');
const http = require('http');
const { Server } = require('socket.io');

let redis;
let useRedis = false;

try {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL);
  
  redis.on('connect', () => {
    useRedis = true;
    console.log('Dashboard connected to Redis');
  });
  
  redis.on('error', () => {
    useRedis = false;
    console.log('Dashboard using fallback data');
  });
} catch (err) {
  console.log('Dashboard using fallback data');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//––– View engine & static
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '.'));
app.use(express.static(path.resolve(__dirname, 'public')));

//––– 1. Basic-Auth (Admin login)
app.use(basicAuth({
  users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
  challenge: true,
  realm: 'Dashboard'
}));

//––– 2. IP Whitelist
const ALLOWED_IPS = process.env.DASH_ALLOW_IPS.split(',');
app.use((req, res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (forwarded || req.socket.remoteAddress)
                     .split(',')[0].trim()
                     .replace(/^::ffff:/, '');
  if (!ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).send('Forbidden');
  }
  next();
});

//––– Metrics helpers
async function getCount(key) {
  if (!useRedis || !redis) return 0;
  try {
    const v = await redis.get(key);
    return parseInt(v || '0', 10);
  } catch (err) {
    return 0;
  }
}

async function getTimeSeries(setKey) {
  if (!useRedis || !redis) return {};
  try {
    const now = Date.now();
    const oneHourAgo = now - 1000 * 60 * 60;
    const stamps = await redis.zrangebyscore(setKey, oneHourAgo, now);
    const buckets = {};
    stamps.forEach(ts => {
      // bucket by minute label "HH:MM"
      const date = new Date(+ts);
      const label = date.toTimeString().substr(0, 5);
      buckets[label] = (buckets[label] || 0) + 1;
    });
    return buckets;
  } catch (err) {
    return {};
  }
}

async function getMetrics() {
  const throughput = await getCount('throughput');
  const transCount = await getCount('translation:count');
  const cacheHits = await getCount('cache:detect:hits') + await getCount('cache:trans:hits');
  const cacheMisses = await getCount('cache:detect:misses') + await getCount('cache:trans:misses');
  
  let langCounts = {};
  if (useRedis && redis) {
    try {
      langCounts = await redis.hgetall('lang:counts');
    } catch (err) {
      langCounts = {};
    }
  }
  
  const detectSeries = await getTimeSeries('events:detect');
  const transSeries = await getTimeSeries('events:trans');

  return { throughput, transCount, cacheHits, cacheMisses, langCounts, detectSeries, transSeries };
}

//––– 3. HTTP Route
app.get('/', async (req, res) => {
  const metrics = await getMetrics();
  const series = { detectSeries: metrics.detectSeries, transSeries: metrics.transSeries };
  res.render('index', { metrics, series });
});

//––– 4. WebSocket: push updates
io.on('connection', socket => {
  console.log('Dashboard client connected:', socket.id);
  // send initial snapshot
  getMetrics().then(metrics => socket.emit('metricsUpdate', metrics));
});

// broadcast every 5s
setInterval(async () => {
  const metrics = await getMetrics();
  io.emit('metricsUpdate', metrics);
}, 5_000);

//––– Start server
const PORT = process.env.DASH_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Dashboard secured & live at http://localhost:${PORT}`);
});
