var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = new Schema({
  searchId: Schema.Types.ObjectId,
  sequence: Number,
  id: String,
  words: Object,
  minutes: Number
});

module.exports = mongoose.model('Video', VideoSchema);