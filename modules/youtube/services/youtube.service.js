const axios = require('axios')
const GOOGLE_KEY = process.env.GOOGLE_KEY

const getDetails = async (url) => {
  let client = axios.create({
    baseURL: 'https://www.googleapis.com',
    timeout: 60000
  })
  let res = await client.get(url)
  let title = res.data.items[0].snippet && res.data.items[0].snippet.title ? res.data.items[0].snippet.title : ''
  let description = res.data.items[0].snippet && res.data.items[0].snippet.description ? res.data.items[0].snippet.description : ''
  let duration = res.data.items[0].contentDetails ? formatDurationInMinutes(res.data.items[0].contentDetails.duration) : 0
  if (!duration || !title || !description) {
    if (!duration) {
      console.log('not duration')
    }
    if (!title) {
      console.log('not title')
    }
    if (!description) {
      console.log('not description')
    }
    console.log(url)
  }
  return {
    duration,
    title,
    description
  }
}

const getVideos = async (text, total, pageToken = '') => {
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
      url: `https://www.googleapis.com/youtube/v3/videos?key=${GOOGLE_KEY}&part=contentDetails,snippet&id=${id}`
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
  getDetails,
  getVideos
}