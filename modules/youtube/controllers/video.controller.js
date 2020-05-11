const VideoService = require('./../services/video.service.js')

const getBySearchId = async (searchId) => {
  let videos = await VideoService.getBySearchId(searchId)

  return videos
};

module.exports = {
  getBySearchId
}
