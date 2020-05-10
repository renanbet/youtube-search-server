var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SearchSchema = new Schema({
  user: Schema.Types.ObjectId,
  text: String,
  date: Date,
  daysLong: Number,
  words: Array
});

module.exports = mongoose.model('Search', SearchSchema);