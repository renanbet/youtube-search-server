const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SearchSchema = new Schema({
  user: Schema.Types.ObjectId,
  text: String,
  date: Date,
  daysLong: Number,
  words: Array
});

module.exports = mongoose.model('Search', SearchSchema);