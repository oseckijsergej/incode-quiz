var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;

var bcrypt = require('bcrypt');

var AccountSchema = new Schema({
    // eMail address
    email: {type: Email, unique: true},

    // Password
    salt: {type: String, required: true},
    hash: {type: String, required: true},

    login: {type: String, required: true},
});

AccountSchema.virtual('password').get(function () {
    return this._password;
}).set(function (password) {
    this._password = password;
    var salt = this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, salt);
});

AccountSchema.method('checkPassword', function (password, callback) {
    bcrypt.compare(password, this.hash, callback);
});

AccountSchema.static('authenticate', function (login, password, callback) {
    this.findOne({login: login}, function (err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(null, false);

        user.checkPassword(password, function (err, passwordCorrect) {
            if (err)
                return callback(err);

            if (!passwordCorrect)
                return callback(null, false);

            return callback(null, user);
        });
    });
});

module.exports = mongoose.model('Account', AccountSchema);