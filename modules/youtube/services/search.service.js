const textLib = require('../lib/text.lib')
const SearchModel = require('../models/search.model')
const ScheduleService = require('./schedule.service')
const DateService = require('../lib/date')
const YouTubeService = require('./youtube.service')
const VideoService = require('./video.service')

const get = async (userId) => {
  return await SearchModel.findOne(
    { user: userId })
}

const getByUser = async (userId) => {
  return await SearchModel.find(
    { user: userId })
}

const insert = async (search) => {
  let searchModel = new SearchModel()
  searchModel.user = search.user
  searchModel.text = search.text
  searchModel.date = DateService.getToday()
  searchModel.daysLong = 0
  searchModel.words = []

  return await searchModel.save()
};

const searchVideos = async (searchId, text, userId) => {
  const maxVideos = 200
  let totalResults = 200
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
  
  let nextPageToken = ''
  try {
    while ((countAllVideos < maxVideos && countAllVideos < totalResults)) {
      console.log('Total visitados', countAllVideos)
      console.log('Total registrado', countIncludedVideos)
      let videos = await YouTubeService.getVideos(text, 20, nextPageToken)
      nextPageToken = videos.nexPageToken
      totalResults = videos.totalResults
      let urls = videos.urls
      for (const [idx, url] of urls.entries()) {
        const details = await YouTubeService.getDetails(url.url)
        if (!details.duration || details.duration > maxTime || !(details.title || details.description)) {
          countAllVideos++
          continue
        }
        durationSequence.push(details.duration)

        let words = textLib.counter(`${details.title} ${details.description}`)
        let video = {
          search: searchId,
          sequence: countIncludedVideos + 1,
          id: url.id,
          minutes: details.duration,
          words,
          title: details.title
        }

        await VideoService.insert(video)

        countIncludedVideos++
        countAllVideos++
        if (countAllVideos === maxVideos ||
          countAllVideos === totalResults) {
          break;
        }
      }
    }

    let totalDays = calcTime(orderSchedule, durationSequence)
    let top5Words = await getTopWords(searchId)
    
    await SearchModel.findOneAndUpdate({ _id: searchId }, { daysLong: totalDays, words: top5Words })

    return {
      totalDays,
      top5Words
    }
  } catch (e) {
    console.log(e)
  }
}

const getTotalDays = async (searchId) => {
  let search = await SearchModel.findOne({
    _id: searchId
  })
  let total = search.daysLong
  if (!total) {
    let userSchedule = await ScheduleService.getByUser(search.user)

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
    let durationSequence = []
    
    let videos = await VideoService.getBySearchId(searchId)
    for(let i = 0; i < videos.length; i++) {
      durationSequence.push(videos[i].minutes)
    }
    let totalDays = calcTime(orderSchedule, durationSequence)
    total = totalDays
    search.daysLong = total
    await search.save()
  }
  return total
}

const calcTime = (schedule, videos) => {
  let scheduleCopy = []
  scheduleCopy.push(...schedule)
  let currentDay = 0
  let countDays = 0

  for (let i = 0; i < videos.length; i++) {
    let time = videos[i]
    let dayTime = schedule[currentDay]

    while (time > dayTime) {
      schedule[currentDay] = scheduleCopy[currentDay]
      currentDay = currentDay === 6 ? 0 : currentDay + 1
      countDays++
      dayTime = schedule[currentDay]
    }

    schedule[currentDay] = schedule[currentDay] - time
  }
  return countDays + 1
}

const getTopWords = async (searchId) => {
  return await VideoService.getTopWords(searchId, 5)
}

module.exports = {
  get,
  getByUser,
  insert,
  searchVideos,
  getTopWords,
  getTotalDays
}
