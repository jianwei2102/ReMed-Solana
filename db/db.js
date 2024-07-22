const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://jianwei2102:dev123@remed-db.b0pom6z.mongodb.net/remed?retryWrites=true&w=majority&appName=ReMed-db', {});

        console.log(`MongoDB Connected`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;

