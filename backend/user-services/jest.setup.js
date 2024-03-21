const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

async function connectToDatabase() {
    // Check if mongoose already has a connection
  if (mongoose.connection.readyState === 0) { // 0 = disconnected
    try {
      await mongoose.connect(process.env.TEST_DB_CONNECTION);
      console.log('Connected to Test DB');
    } catch (error) {
      console.error('Failed to connect to Test DB', error);
    }
  }
}
  
async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) { // Not disconnected
    try {
      await mongoose.disconnect();
      console.log('Disconnected from Test DB');
    } catch (error) {
      console.error('Failed to disconnect from Test DB', error);
    }
  }
}
async function clearCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
  }

}

// Usage in Jest global setup/teardown
beforeAll(connectToDatabase);
beforeEach(clearCollections)
afterAll(disconnectFromDatabase);

  


