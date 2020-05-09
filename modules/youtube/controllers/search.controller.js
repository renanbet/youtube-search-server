var SearchModel = require('./../models/search.model.js')
const DateService = require('./../lib/date')

const get = async (id) => {
  let schedule = await ScheduleModel.findOne(
    { user: id })

  return schedule
};

const insert = async (search, userId) => {
  var searchModel = new SearchModel()
  searchModel.user = userId
  searchModel.text = search.text
  searchModel.date = search.date
  searchModel.durationDays = search.durationDays

  await scheduleModel.save()
  return true
};

module.exports = {
  get,
  insert
}
