const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller')
const Auth = require('../../authentication/lib/auth')

router.get('/:searchId', Auth.ensureAuthorized, async (req, res, next) => {
  try {
    let ret = await videoController.getBySearchId(req.params.searchId)
    res.json(ret)
  } catch (error) {
    console.log(error)
    res.status(400)
      .json(error);
  }
});

module.exports = router;