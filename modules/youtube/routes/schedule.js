var express = require('express');
var router = express.Router();
const scheduleController = require('../controllers/schedule.controller')
const Auth = require('../../authentication/lib/auth')

router.post('/', Auth.ensureAuthorized, async (req, res) => {
  try {
    let ret = await scheduleController.insert(req.body, req.authUser.id)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

router.get('/', Auth.ensureAuthorized, async (req, res, next) => {
  try {
    let ret = await scheduleController.get(req.authUser.id)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

module.exports = router;