module.exports = {
  apps: [
    {
      name: 'fuel-app',
      script: 'server/index-new.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};