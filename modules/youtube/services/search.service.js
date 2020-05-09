const axios = require('axios')
const textLib = require('../lib/text.lib')
const GOOGLE_KEY = process.env.GOOGLE_KEY
var SearchModel = require('../models/search.model.js')

const DateService = require('../lib/date')

const get = async (id) => {
  return await SearchModel.findOne(
    { user: id })
}

const insert = async (schedule) => {
  var searchModel = new SearchModel()
  searchModel.user = userId
  searchModel.text = search.text
  searchModel.date = search.date
  searchModel.durationDays = search.durationDays

  return await searchModel.save()
};

const searchVideos = async (text) => {
  let url = `https://www.googleapis.com`
  let totalVideos = 0
  let videosArray = []

  try {
    let client = axios.create({
      baseURL: url,
      timeout: 60000
    })
    let videos = await client.get(`/youtube/v3/search?key=${GOOGLE_KEY}&part=id&q=${text}&type=video&maxResults=1`)
    let items = videos.data.items

    let urls = []
    items.forEach(item => {
      let id = item.id.videoId
      urls.push({
        id,
        url: `https://www.googleapis.com/youtube/v3/videos?key=${GOOGLE_KEY}&part=contentDetails&part=snippet&id=${id}`
      })
    })

    for (const [idx, url] of urls.entries()) {
      const details = await client.get(url.url)
      let snnipet = details.data.items[0].snippet
      let contentDetails = details.data.items[0].contentDetails
      let title = snnipet.title
      let description = snnipet.description
      let duration = formatDurationInMinutes(contentDetails.duration)
      let words = textLib.counter(`${title} ${description}`)

      videosArray.push({
        sequence: idx + 1,
        id: url.id,
        words,
        minutes: duration
      })
    }
    return videosArray
  } catch (e) {
    console.log(e)
  }
}

formatDurationInMinutes = (duration) => {
  console.log('duration', duration)
  let seconds = 0
  let minutes = 0
  let hours = 0
  duration = duration.substring(2)
  seconds = duration.substring(duration.length - 3, duration.length - 1)
  duration = duration.substring(0, duration.length - 3)
  if (duration) {
    minutes = duration.substring(duration.length - 3, duration.length - 1)
  }
  duration = duration.substring(0, duration.length - 3)
  if (duration) {
    hours = duration.substring(duration.length - 3, duration.length - 1)
  }
  minutes = parseInt(seconds) === 0 ? parseInt(minutes) : parseInt(minutes) + 1
  return (parseInt(hours) * 60) + minutes
}

module.exports = {
  get,
  insert,
  searchVideos
}
