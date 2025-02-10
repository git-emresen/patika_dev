const mongoose=require('mongoose');
const config = require('../config');

let instance = null;
class Database {
    constructor() {
        if (!instance) {
            this.mongoConnection = null;
            instance = this;
        }
        return instance;
    }

    
    async connect() {
        if (this.mongoConnection) {
            return this.mongoConnection;
        }

        try {
            this.mongoConnection = await mongoose.connect(config.CONNECTION_STRING);
            console.log('MongoDB connection established');
            return this.mongoConnection;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        if (!this.mongoConnection) {
            return; 
        }

        try {
            await mongoose.disconnect();
            this.mongoConnection = null;
            console.log('MongoDB connection closed');
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }

}

module.exports = Database;