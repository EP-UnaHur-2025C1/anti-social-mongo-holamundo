const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis', // nombre del servicio
    port: process.env.REDIS_PORT || 6379,
  }
});

redisClient.on('error', (err) => console.error('Redis error: ', err));

module.exports = redisClient;