const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./config/seeder');
const app = require('./app');

dotenv.config();

connectDB().then(() => {
  seedData();
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
