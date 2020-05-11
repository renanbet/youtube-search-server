const SearchService = require('./../services/search.service.js')

const get = async (id) => {
  let search = await SearchService.get(id)

  return search
};

const getByUser = async (userId) => {
  let searches = await SearchService.getByUser(userId)

  return searches
};

const insert = async (search, userId) => {
  search.user = userId
  let newSearch = await SearchService.insert(search)
  return newSearch
};

const searchVideos = async (searchId, text, userId) => {
  let searchVideos = await SearchService.searchVideos(searchId, text, userId)
  return searchVideos
}

const getTopWords = async (searchId) => {
  let topWords = await SearchService.getTopWords(searchId)

  return topWords
}

const getTotalDays = async (searchId) => {
  return await SearchService.getTotalDays(searchId)
}

module.exports = {
  get,
  getByUser,
  insert,
  getTopWords,
  getTotalDays,
  searchVideos
}
