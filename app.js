const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const monggose = require('mongoose')


logger.info('connecting to ...', config.MONGODB_URI)

monggose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connecting')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB', error.message)
    })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blog', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
