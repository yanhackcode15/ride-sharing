const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rideRoutes = require('./src/routes/ride.routes'); // Adjust the import path as necessary
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Error loading environment variables:', result.error);
  process.exit(1); // Exit process on environment variable loading failure
}

// Database connection
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit process on database connection failure
  });

// Define base route for trip-related actions
app.use('/rides', rideRoutes);

// Welcome route for the trip service
app.get('/', (req, res) => res.send('Hello Trip Microservice World!'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server if not in test mode
if(process.env.NODE_ENV !== 'test'){
  const port = process.env.PORT || 3002; // Consider using a different port from the user service
  const server = app.listen(port, () => console.log(`Trip Microservice listening on port ${port}!`));

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}


module.exports = app; // Export the app for testing