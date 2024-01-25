let mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1/API');

let db = mongoose.connection;

db.once('open', function (err) {
    (err) ? console.log("db not connect") : console.log("db is connect")
});

module.exports = db;


