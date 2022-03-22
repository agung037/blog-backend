const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const monggose = require('mongoose')


logger.info('connecting to MongoDB...')

monggose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully Connected to MongoDB!')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB', error.message)
  })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
