module.exports = {
  apps: [
    {
      name: 'PAYE Modernisation',
      script: './src/server.js',
      instances: 1,
      autorestart: true,
      watch: true,
      env: {
        PORT: 5000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 5000,
        NODE_ENV: 'production'
      }
    }
  ]
};
