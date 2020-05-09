var SearchService = require('./../services/search.service.js')

const get = async (id) => {
  let search = await SearchService.get(id)

  return search
};

const insert = async (search, userId) => {
  // search.userId = userId
  // return await SearchService.insert(search)
  return await SearchService.searchVideos(search)
};

module.exports = {
  get,
  insert
}
