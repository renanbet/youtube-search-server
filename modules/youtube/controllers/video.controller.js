var VideoModel = require('./../models/video.model.js')
const DateService = require('./../lib/date')

const get = async (searchId) => {
  let video = await VideoModel.findOne(
    { search: searchId })

  return video
};

module.exports = {
  get
}
