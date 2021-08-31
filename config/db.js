const mongoose = require('mongoose')
const CounterModel = require('./counters.model')

// Conexão com o banco de dados
const connection = async (isTest = false, testSufix = '') => {
  const DB_USER = process.env.DB_USER
    ? `${process.env.DB_USER}:${process.env.DB_PASS}@`
    : ''
  const TEST_DB_NAME = process.env.TEST_DB_NAME
    ? process.env.TEST_DB_NAME
    : 'test'

  const dbUrl = isTest
    ? `mongodb://${DB_USER}${process.env.DB_HOST}:${process.env.DB_PORT}/${TEST_DB_NAME}${testSufix}`
    : `mongodb://${DB_USER}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

  console.log(dbUrl)
  console.log('start db connection...')
  try {
    await mongoose.connect(dbUrl)
    await startCounter('query')
    /*
     * Ativa o debug para log do contador de queries
     */
    mongoose.set('debug', async (collection) => {
      if (collection !== 'counters') {
        await logCounter('query')
      }
    })
    console.log('db created!')
    return true
  } catch (err) {
    console.log('db connection error')
    console.log(err)
    return false
  }
}

// Status do banco de dados
const status = () => {
  const status = ['disconnected', 'connected', 'connecting', 'disconnecting']
  return status[mongoose.connection.readyState]
}

/*
 * Inicializa o log de contadores em 0
 */
const startCounter = async (value) => {
  let counter = await CounterModel.findOne({
    value,
  })
  if (!counter) {
    let counter = new CounterModel({
      value,
      count: 0,
    })
    counter.save()
  } else {
    const filter = { value }
    const update = { count: 0 }
    try {
      await CounterModel.updateOne(filter, update)
    } catch (e) {
      console.log(e)
    }
  }
}

/*
 * Log de contadores, incremeta +1
 */
const logCounter = async (value) => {
  const filter = { value }
  const update = {
    $inc: {
      count: 1,
    },
  }
  try {
    await CounterModel.updateOne(filter, update)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  db: mongoose,
  connection,
  status,
}
