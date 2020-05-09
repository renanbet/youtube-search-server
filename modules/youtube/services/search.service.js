const axios = require('axios')
const textLib = require('../lib/text.lib')
const GOOGLE_KEY = process.env.GOOGLE_KEY
const SearchModel = require('../models/search.model')
const ScheduleService = require('./schedule.service')
const DateService = require('../lib/date')

const get = async (userId) => {
  return await SearchModel.findOne(
    { user: userId })
}

const getAll = async (userId) => {
  return await SearchModel.find(
    { user: userId })
}

const insert = async (search) => {
  var searchModel = new SearchModel()
  searchModel.user = search.user
  searchModel.text = search.text
  searchModel.date = DateService.getToday()
  searchModel.durationDays = 0

  return await searchModel.save()
};

const searchVideos = async (id, text, userId) => {
  let userSchedule = await ScheduleService.getByUser(userId)
  
  let schedule = []
  schedule.push(userSchedule.sunday)
  schedule.push(userSchedule.monday)
  schedule.push(userSchedule.tuesday)
  schedule.push(userSchedule.wednesday)
  schedule.push(userSchedule.thursday)
  schedule.push(userSchedule.friday)
  schedule.push(userSchedule.saturday)

  let weekDay = DateService.weekDay()
  let orderSchedule = schedule.slice(weekDay).concat(schedule.slice(0, weekDay))
  let maxTime = Math.max(...schedule)
  
  let url = `https://www.googleapis.com`
  let totalVideos = 0
  let videosArray = []

  try {
    let client = axios.create({
      baseURL: url,
      timeout: 60000
    })
    let videos = await client.get(`/youtube/v3/search?key=${GOOGLE_KEY}&part=id&q=${text}&type=video&maxResults=2`)
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
      let duration = formatDurationInMinutes(contentDetails.duration)
      let words = textLib.counter(`${snnipet.title} ${snnipet.description}`)

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
  getAll,
  insert,
  searchVideos
}
