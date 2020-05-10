const ScheduleModel = require('./../models/schedule.model.js')
const DateServicie = require('./../lib/date')

const get = async (id) => {
  return await ScheduleModel.findOne(
    { _id: id })
}

const getByUser = async (userId) => {
  return await ScheduleModel.findOne(
    { user: userId }, {}, { sort: { 'date': -1} })
}

const insert = async (schedule) => {
  let scheduleModel = new ScheduleModel()
  scheduleModel.user = schedule.user
  scheduleModel.sunday = schedule.sunday
  scheduleModel.monday = schedule.monday
  scheduleModel.tuesday = schedule.tuesday
  scheduleModel.wednesday = schedule.wednesday
  scheduleModel.thursday = schedule.thursday
  scheduleModel.friday = schedule.friday
  scheduleModel.saturday = schedule.saturday
  scheduleModel.date = DateServicie.getToday()
  
  return await scheduleModel.save()
};

module.exports = {
  get,
  getByUser,
  insert
}
