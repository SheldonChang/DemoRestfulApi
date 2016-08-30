var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DemoSchema = new Schema({
    board_name: String,
    decription: String,
    date: { type: Date, default: Date.now },
    comments: [{
        post_user: String,
        content: String,
        posted: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('demo', DemoSchema);
