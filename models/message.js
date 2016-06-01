var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    room    : {type: Schema.Types.ObjectId, ref: 'chatRoom'},
    sender  : {type: Schema.Types.ObjectId, ref: 'Account'},
    created : { type : Date, default : Date.now },
    text    : String
});

module.exports = mongoose.model('Message', MessageSchema);