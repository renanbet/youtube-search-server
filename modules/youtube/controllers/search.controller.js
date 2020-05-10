const SearchService = require('./../services/search.service.js')

const get = async (id) => {
  let search = await SearchService.get(id)

  return search
};

const getAll = async (userId) => {
  let search = await SearchService.get(id)

  return search
};

const insert = async (search, userId) => {
  search.user = userId
  let searchId = await SearchService.insert(search)
  let searchVideos = await SearchService.searchVideos(searchId, search.text, userId)
  return searchVideos
};

const getTopWords = async (searchId) => {
  let topWords = await SearchService.getTopWords(searchId)

  return topWords
}

const getTotalDays = async (searchId) => {
  return await SearchService.getTotalDays(searchId)
}

module.exports = {
  get,
  insert,
  getTopWords,
  getTotalDays
}
