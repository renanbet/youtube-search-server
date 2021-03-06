const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller')
const Auth = require('../../authentication/lib/auth')

router.post('/', Auth.ensureAuthorized, 
  async (req, res) => {
  try {
    let search = req.body
    let ret = await searchController.insert(search, req.authUser.id)
    res.json(ret)
    await searchController.searchVideos(ret._id, ret.text, req.authUser.id)
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/', Auth.ensureAuthorized, async (req, res, next) => {
  let authUser = req.authUser

  try {
    let ret = await searchController.getByUser(authUser.id)
    res.json(ret)
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/:id', Auth.ensureAuthorized, async (req, res, next) => {
  try {
    let ret = await searchController.get(req.params.id)
    res.json(ret)
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/topwords/:searchId', Auth.ensureAuthorized, async (req, res, next) => {
  let authUser = req.authUser

  try {
    let ret = await searchController.getTopWords(req.params.searchId)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/totaldays/:searchId', Auth.ensureAuthorized, async (req, res, next) => {
  let authUser = req.authUser

  try {
    let ret = await searchController.getTotalDays(req.params.searchId)
    res.json(ret)
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

module.exports = router;