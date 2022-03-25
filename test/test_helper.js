const Blog = require('../models/blog')

const initialBlog = [
  {
    'title': 'The Legend',
    'author': 'nino',
    'url': 'googleg.com',
    'likes': 9,
  },
  {
    'title': 'Bald and Bold',
    'author': 'nino',
    'url': 'goo3gleg.com',
    'likes': 19,
  }
]

const initialUser = [
  {
    'username': 'perez',
    'name': 'Sergio Perez',
    'password': 'toratora'
  },
  {
    'username': 'alonso',
    'name': 'Fernando Alonso',
    'password': 'toratora'
  },
  {
    'username': 'max',
    'name': 'Max Verstappen',
    'password': 'toratora'
  },
  {
    'username': 'tsunoda',
    'name': 'Yuki Tsunoda',
    'password': 'toratora'
  },

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
  initialBlog, nonExistingId, blogInDb, initialUser
}