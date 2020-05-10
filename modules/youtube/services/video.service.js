const VideoModel = require('./../models/video.model.js')
const removeWords = require('../data/removed-words.json')

const get = async (id) => {
  return await VideoModel.findOne(
    { user: id })
}

const insert = async (video) => {
  let videoModel = new VideoModel()
  videoModel.search = video.search
  videoModel.sequence = video.sequence
  videoModel.id = video.id
  videoModel.words = video.words
  videoModel.minutes = video.minutes

  return await videoModel.save()
};

const getTopWords = async (searchId, top) => {
  let videos = await VideoModel.find(
    { search: searchId }
  )
  allWords = {}
  for (let i = 0; i < videos.length; i++) {
    let words = videos[i].words
    Object.keys(words).filter(item => {
      return !removeWords.includes(item)
    }).forEach(item => {
      allWords[item] = allWords[item] ? parseInt(allWords[item]) + parseInt(words[item]) : parseInt(words[item])
    })
  }
  let order = Object.entries(allWords).sort((a, b) => {
    if (a[1] > b[1])
      return -1
    if (a[1] < b[1])
      return 1
    return 0
  })
  return order.slice(0, top)
}

const getBySearchId = async (searchId) => {
  return await VideoModel.find(
    { search: searchId }).sort({sequence: 1})
}

module.exports = {
  get,
  insert,
  getTopWords,
  getBySearchId
}
