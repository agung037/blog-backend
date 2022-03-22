const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blog = await Blog.find({})
  response.json(blog) 
})


blogRouter.post('/', async (request, response) => {

  const body = request.body

  if(!body.url || !body.title){
    response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogRouter.delete('/:id', async(request, response) => {
    
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()

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
