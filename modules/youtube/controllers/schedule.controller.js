const ScheduleService = require('./../services/schedule.service')

const getByUser = async (userId) => {
  return await ScheduleService.getByUser(userId)
};

const insert = async (schedule, userId) => {
  schedule.user = userId
  return await ScheduleService.insert(schedule)
};

module.exports = {
  getByUser,
  insert
}
