var VideoModel = require('./../models/video.model.js')

const DateService = require('./../lib/date')

const get = async (id) => {
  return await VideoModel.findOne(
    { user: id })
}

const insert = async (video) => {
  var videoModel = new VideoModel()
  videoModel.search = video.searchId
  videoModel.sequence = video.sequence
  videoModel.id = video.id
  videoModel.words = video.words
  videoModel.minutes = video.minutes

  return await videoModel.save()
};

module.exports = {
  get,
  insert
}
