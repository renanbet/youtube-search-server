var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = new Schema({
  search: Schema.Types.ObjectId,
  sequence: Number,
  url: String,
  title: String,
  description: String,
  minutes: Number
});

module.exports = mongoose.model('Video', VideoSchema);