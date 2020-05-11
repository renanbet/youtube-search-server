const moment = require('moment-timezone')
const TIMEZONE = process.env.TIMEZONE || 'America/Sao_Paulo'

function Date() { }

Date.prototype.getFormattedDate = (value, format = 'DD/MM/YYYY') => {
  if (!value) {
    return ''
  }

  return moment(value).tz(TIMEZONE).format(format)
}

Date.prototype.getToday = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment().tz(TIMEZONE).format(format)
}

Date.prototype.getDate = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(value).tz(TIMEZONE).format(format)
}

module.exports = new Date()
