const translateAPI = require('@vitalets/google-translate-api');
const cache = require('./cache');
const metrics = require('./metrics');

async function detectLanguage(text) {
  const key = `detect:${text}`;
  const cached = await cache.get(key);
  if (cached) {
    await metrics.incr('cache:detect:hits');
    await metrics.incr('throughput');
    return cached;
  }
  await metrics.incr('cache:detect:misses');
  const res = await translateAPI(text);
  const lang = res.from.language.iso;
  await cache.set(key, lang);
  await metrics.incr('throughput');
  await metrics.hincr('lang:counts', lang);
  await metrics.recordEvent('events:detect');
  return lang;
}

async function translate(text, target) {
  const key = `trans:${text}:${target}`;
  const cached = await cache.get(key);
  if (cached) {
    await metrics.incr('cache:trans:hits');
  } else {
    await metrics.incr('cache:trans:misses');
    const res = await translateAPI(text, { to: target });
    await cache.set(key, res.text);
  }
  await metrics.incr('translation:count');
  await metrics.recordEvent('events:trans');
  return cached || (await cache.get(key)); // ensure we return the fresh text
}

module.exports = { detectLanguage, translate };
