/*
 * Rotas do módulo status
 */
var express = require('express')
var router = express.Router()
const controller = require('../controllers/status.controller')

router.get('/', async (req, res, next) => {
  try {
    let data = await controller.getStatus()
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = router
