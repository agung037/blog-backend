/* eslint-disable no-undef */
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  // populate 'user' berasal dari field yang ada di schema blog, masukan parameter apa saja yang ingin ditampilkan
  const blog = await Blog.find({}).populate('user', {username: true, name:true})
  response.json(blog) 
})


blogRouter.post('/', async (request, response) => {
  const body = request.body

  // pastikan body memiliki file url dan field title
  if(!body.url || !body.title){
    response.status(400).end()
  }

  // cek apakah sudah ada parameter user di dalam request
  const user = request.user

  console.log(user)

  // buat object yang isinya blog baru
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id
  })



  // menyimpan blog baru, yang didalamnya sudah ada field user berisi id
  const savedBlog = await blog.save()

  // menambahkan id blog kepada field blogs di dalam db user
  user.blogs = user.blogs.concat(savedBlog._id)

  // menyimpan user (dengan penambahan blogs id diatas)
  await user.save()

  // mengembalikan nilai
  response.json(savedBlog)

})

blogRouter.delete('/:id', async(request, response) => {
  
  // cek apakah blog tersedia
  const blog = await Blog.findById(request.params.id).populate('user', {username: true, id: true})
  
  if(!blog){
    return response.status(404).json({error: 'Blog not found'})
  }

  // const token = request.token
  // const decodedToken = jwt.verify(token, process.env.SECRET)

  const idCreator = blog.user.id

  // cek apakah token sama dengan id creator
  const ableToDelete = idCreator === request.user.id

  // jika boleh di hapus maka hapus
  if (ableToDelete){
    await Blog.findByIdAndRemove(request.params.id)
    console.log('berhasil dihapus')
    // response 204 berarti sukses menghapus
    return response.status(204).end()
  }else{
    return response.status(401).json({error: 'current user unauthorize to delete this post'})
  }

})


blogRouter.put('/:id', async (request, response) => {


  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)



})


module.exports = blogRouter
