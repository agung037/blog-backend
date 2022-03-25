/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')


loginRouter.post('/', async (request, response) => {

  const {username, password} = request.body

  // mencari user berdasarkan username
  const user = await User.findOne({username})
  
  // nilai false jika user tidak ditemukan atau gagal compare
  const passwordCorrect = user === null 
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // tampilkan error jika user tidak ada atau password salah
  if(!(user && passwordCorrect)){
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({
      token, 
      username: user.username, 
      name:user.name
    })
})


module.exports = loginRouter