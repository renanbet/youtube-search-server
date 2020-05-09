var express = require('express');
var router = express.Router();
const searchController = require('../controllers/search.controller')
const Auth = require('../../authentication/lib/auth')

router.post('/', //Auth.ensureAuthorized, 
  async (req, res) => {
  try {
    req.authUser = {}
    req.authUser.id = 0
    let ret = await searchController.insert(req.body.search, req.authUser.id)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/', Auth.ensureAuthorized, async (req, res, next) => {
  let authUser = req.authUser

  try {
    let ret = await searchController.get(authUser.id)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

module.exports = router;