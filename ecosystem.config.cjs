module.exports = {
  apps: [
    {
      name: "info75-site-servicos",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
