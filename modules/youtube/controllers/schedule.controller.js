var ScheduleModel = require('./../models/schedule.model.js')
const DateService = require('./../lib/date')

const get = async (id) => {
  let schedule = await ScheduleModel.findOne(
    { user: id })

  return schedule
};

const insert = async (schedule, userId) => {
  var scheduleModel = new ScheduleModel()
  scheduleModel.user = userId
  scheduleModel.sunday = schedule.sunday
  scheduleModel.monday = schedule.monday
  scheduleModel.tuesday = schedule.tuesday
  scheduleModel.wednesday = schedule.wednesday
  scheduleModel.thursday = schedule.thursday
  scheduleModel.friday = schedule.friday
  scheduleModel.saturday = schedule.saturday

  await scheduleModel.save()
  return true
};

module.exports = {
  get,
  insert
}
