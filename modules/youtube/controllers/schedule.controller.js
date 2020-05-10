const ScheduleService = require('./../services/schedule.service')

const get = async (id) => {
  return await scheduleService.get(id)
};

const insert = async (schedule, userId) => {
  schedule.user = userId
  return await ScheduleService.insert(schedule)
};

module.exports = {
  get,
  insert
}
