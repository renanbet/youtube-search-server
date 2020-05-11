const bluebird = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = bluebird
const mongooseRegisterEvents = require('./mongooseRegisterEvents')

const {
  MONGO_DB,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PWD,
  MONGO_PROTOCOL
} = process.env

let user = MONGO_USER ? `${MONGO_USER}:${encodeURIComponent(MONGO_PWD)}@` : ''
let port = MONGO_PORT ? `:${MONGO_PORT}` : ''

let url = `${MONGO_PROTOCOL}://${user}${MONGO_HOST}${port}/${MONGO_DB}`

const options = {
  useNewUrlParser: true,
  autoIndex: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

module.exports = async (mongoUrl) => {
  if (mongoUrl) {
    url = mongoUrl
  }

  try {
    mongooseRegisterEvents(mongoose)
    await mongoose.connect(url, options)
  } catch (error) {
    console.error(`Failed to connect to mongo db: ${error}`)
  }

  mongoose.set('debug', false)
}
