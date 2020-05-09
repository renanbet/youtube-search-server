var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SearchSchema = new Schema({
  user: Schema.Types.ObjectId,
  text: String,
  date: Date,
  durationDays: Number
});

module.exports = mongoose.model('Search', SearchSchema);