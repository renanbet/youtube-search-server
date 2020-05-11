const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  search: Schema.Types.ObjectId,
  sequence: Number,
  id: String,
  words: Object,
  minutes: Number,
  title: String
});

module.exports = mongoose.model('Video', VideoSchema);