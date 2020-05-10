const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  user: Schema.Types.ObjectId,
  sunday: Number,
  monday: Number,
  tuesday: Number,
  wednesday: Number,
  thursday: Number,
  friday: Number,
  saturday: Number,
  date: Date
});

module.exports = mongoose.model('Schedule', ScheduleSchema);