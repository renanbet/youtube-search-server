const utils = require('../lib/utils')
const CounterModel = require('../../config/counters.model')

const getStatus = async () => {
  var time = process.uptime()
  let counter = await CounterModel.findOne(
    {
      value: 'query',
    },
    {
      count: true,
    }
  )
  return {
    uptime: utils.formatUpTime(time),
    consultas: counter.count,
  }
}

module.exports = {
  getStatus,
}
