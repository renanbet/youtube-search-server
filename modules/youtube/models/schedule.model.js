var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  user: Schema.Types.ObjectId,
  sunday: Number,
  monday: Number,
  tuesday: Number,
  wednesday: Number,
  thursday: Number,
  friday: Number,
  saturday: Number
});

module.exports = mongoose.model('Schedule', ScheduleSchema);