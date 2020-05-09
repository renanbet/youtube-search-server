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
  const maxVideos = 40
  let totalResults = 0
  let countIncludedVideos = 0
  let countAllVideos = 0

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
  let durationSequence = []

  let videosArray = []
  let nextPageToken = ''
  try {

    let videos = await getVideos(text, 20, nextPageToken)
    nextPageToken = videos.nexPageToken
    totalResults = videos.totalResults
    let urls = videos.urls

    for (const [idx, url] of urls.entries()) {
      const details = await getDetails(url.url)
      let words = details.title ? textLib.counter(`${details.title} ${details.description}`) : {}
      if (!details.duration || details.duration > maxTime || !Object.values(words).length) {
        console.log('duration', details.duration)
        console.log('words', Object.values(words).length)
        console.log('Video descartado')
        console.log('-----------------')
        countAllVideos++
        continue
      }
      durationSequence.push(details.duration)
      videosArray.push({
        sequence: countIncludedVideos + 1,
        id: url.id,
        minutes: details.duration,
        words
      })

      countIncludedVideos++
      countAllVideos++
      if(countIncludedVideos === maxVideos || 
          countAllVideos === totalResults) {
            break;
          }
    }
    console.log(orderSchedule)
    console.log(durationSequence)
    return videosArray
  } catch (e) {
    console.log(e)
  }
}

getDetails = async (url) => {
  let client = axios.create({
    baseURL: 'https://www.googleapis.com',
    timeout: 60000
  })
  let res = await client.get(url)
  let title = res.data.items[0].snippet ? res.data.items[0].snippet.title : ''
  let description = res.data.items[0].snippet ? res.data.items[0].snippet.description : ''
  let duration = res.data.items[0].contentDetails ? formatDurationInMinutes(res.data.items[0].contentDetails.duration) : 0
  return {
    duration,
    title,
    description
  }
}

getVideos = async (text, total, pageToken = '') => {
  let client = axios.create({
    baseURL: 'https://www.googleapis.com',
    timeout: 60000
  })
  pageToken = pageToken ? `&pageToken=${pageToken}` : ''
  let url = `https://www.googleapis.com/youtube/v3/search?key=${GOOGLE_KEY}&part=id&q=${text}&type=video&maxResults=${total}${pageToken}`
  let videos = await client.get(url)

  let items = videos.data.items
  let urls = []
  items.forEach(item => {
    let id = item.id.videoId
    urls.push({
      id,
      url: `https://www.googleapis.com/youtube/v3/videos?key=${GOOGLE_KEY}&part=contentDetails&part=snippet&id=${id}`
    })
  })
  let nexPageToken = videos.data.nextPageToken
  let totalResults = videos.data.pageInfo.totalResults

  return {
    totalResults,
    nexPageToken,
    urls
  }
}

formatDurationInMinutes = (duration) => {
  let seconds = 0
  let minutes = 0
  let hours = 0
  duration = duration.substring(2)
  if (duration.includes('H')) {
    hours = duration.substring(0, duration.indexOf('H'))
    duration = duration.substring(duration.indexOf('H') + 1)
  }
  if (duration.includes('M')) {
    minutes = duration.substring(0, duration.indexOf('M'))
    duration = duration.substring(duration.indexOf('M') + 1)
  }
  if (duration.includes('S')) {
    seconds = duration.substring(0, duration.indexOf('S'))
    duration = duration.substring(duration.indexOf('S') + 1)
  }
  minutes = parseInt(seconds) === 0 ? parseInt(minutes) : parseInt(minutes) + 1
  let total = (parseInt(hours) * 60) + minutes

  return total
}

module.exports = {
  get,
  getAll,
  insert,
  searchVideos
}
