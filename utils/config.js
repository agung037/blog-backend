/* eslint-disable no-undef */
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI 
  : process.env.MONGODB_URI

module.exports = {
  PORT, MONGODB_URI
}
