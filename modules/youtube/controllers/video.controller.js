const VideoService = require('./../services/video.service.js')

const get = async (id) => {
  let video = await VideoService.get(id)

  return video
};

module.exports = {
  get
}
