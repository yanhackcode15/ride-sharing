const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });


const connect = async () => {
    await mongoose.connect(process.env.TEST_DB_CONNECTION);
};

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

const closeDatabase = async () => {
    await mongoose.disconnect();
};

module.exports = { connect, clearDatabase, closeDatabase };
