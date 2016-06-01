var mongoose = require('mongoose');
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);

var config = require('config');
var dbURI;
var dbOptions

if(process.env.NODE_ENV === "test"){
    dbURI = config.get('mongoose-test:uri');
    dbOptions = config.get('mongoose-test:options');
} else {
    dbURI = config.get('mongoose:uri');
    dbOptions = config.get('mongoose:options');
}

//mongoose.connect(dbURI, dbOptions);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

if(process.env.NODE_ENV === "test"){
    mongoose.connect(config.get('mongoose-test:uri'), config.get('mongoose-test:options'));
} else {
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
}

module.exports = mongoose;
