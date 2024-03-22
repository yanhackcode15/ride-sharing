const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/user.routes')
const dotenv = require('dotenv')

const app = express();
app.use(cors());
app.use(express.json());

const result = dotenv.config();
if (result.error) {
  console.error('Error loading environment variables:', result.error);
  process.exit(1); // Exit process on environment variable loading failure
}

mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit process on database connection failure
  });

app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Hello User Microservice World!'));

// After all other app.use() and routes calls
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if(process.env.NODE_ENV !== 'test'){
  const port = process.env.PORT || 3001;
  const server = app.listen(port, () => console.log(`User Microservice listening on port ${port}!`));

  //gradeful shutdown
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

module.exports = app; //Export the app for testing