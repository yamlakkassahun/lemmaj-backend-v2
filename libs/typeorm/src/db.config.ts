export default () => ({
  db: {
    type: 'mysql',
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA || undefined,
    logging: 'none',
    migration: {
      enabled: false,
      table: 'migrations',
      distRoot: 'dist',
      dirname: 'migrations',
    },
    tlsEnabled: false,
  },
});
