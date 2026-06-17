const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://gakenge7_db_user:KnHSjb7NerOZzr4u@cluster0.wagyqvm.mongodb.net/?appName=Cluster0'

console.log(mongoURI)

if(!mongoURI) {
    throw new Error('Please provide the mongodb uri in the .env file')
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            autoIndex: true,
        });
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('❌ MongoDB Connection Error: ', error.message);
        process.exit(1);
    }
}

connectDB();