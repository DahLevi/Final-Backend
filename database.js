const mongoose = require('mongoose');

// Where does this come from?
const mongoDB = process.env.MONGODB_URI || 'mongodb+srv://dahlbergl:MongoPassHi@cluster0.yofqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// What is this syntax about?
mongoose
    .connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('DB Connected!');
    })
    .catch(error => {
        console.log('Connection Error: ${err.message}');
    });

const db = mongoose.connection;

// Bind the console to errors, to show them on console
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

module.exports = db;