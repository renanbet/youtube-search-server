var express = require('express');
var router = express.Router();
const videoController = require('../controllers/video.controller')
const Auth = require('../../authentication/lib/auth')

router.get('/', Auth.ensureAuthorized, async (req, res, next) => {
  let authUser = req.authUser

  try {
    let ret = await videoController.get(authUser.id)
    res.json({data: ret})
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

module.exports = router;