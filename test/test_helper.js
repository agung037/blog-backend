const Blog = require('../models/blog')

const initialBlog = [
  {
    'title': 'The Legend',
    'author': 'nino',
    'url': 'googleg.com',
    'likes': 9,
  },
  {
    'title': 'The Cars',
    'author': 'nino',
    'url': 'goo3gleg.com',
    'likes': 19,
  }
    
    
]


const nonExistingId = async () => {
  const blog = new Blog({title: 'willremovethissoon', date: new Date()})
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(b => b.toJSON())
}


module.exports = {
  initialBlog, nonExistingId, blogInDb
}