/* eslint-disable no-undef */
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {

  logger.info('Method:', request.method)
  logger.info('Path : ', request.path)
  logger.info('Body : ', request.body)
  logger.info('---')
  next()
}


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}


const userExtractor = async (request, response, next) => {

  // cek apakah sudah ada token
  if(request.token){
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()

}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformated id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}