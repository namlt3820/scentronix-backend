export default () => {
  return process.env.NODE_ENV === 'test'
    ? {
        redis: {
          host: 'mock-redis-host',
          port: '6379',
          password: 'mock-password',
        },
      }
    : {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD || '123456',
        },
      };
};
