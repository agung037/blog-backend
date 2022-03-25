const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')




// route untuk mendapatkan semua user
userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {url: true, title:true, author:true})
  response.json(users)
})

// route untuk menambahkan user
userRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  // memastikan panjang username dan password lebih dari 3 karakter
  if(username.length < 3 || password.length < 3 ){
    return response.status(400).json({
      error: 'username or password must atleast 3 character long'
    })
  }

  // memastikan tidak ada username yang sama
  const existingUser = await User.findOne({username})
  if(existingUser){
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  // membuat hash password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // membuat object user baru
  const user = new User({
    username, 
    name,
    passwordHash
  })

  // menyimpan user dan memasukannya ke dalam variabel saved user
  const savedUser = await user.save()

  // mengembalikan nilai berupa json dari variable saveduser
  response.status(201).json(savedUser)

})

// mengeksport module agar dapat dipakai dimana mana
module.exports = userRouter