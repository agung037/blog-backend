/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlog
    .map(b => new Blog(b))
  const promiseArray = blogObject.map(b => b.save())
  await Promise.all(promiseArray)

})



describe('initial db value', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
    
})




describe('adding new blog', () => {

  test('success adding blog, with correct body', async () => {
    const newBlog = {
      title: 'the art of code',
      author: 'agung',
      url: 'gengs.com',
      like: 100
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogAtEnds = await helper.blogInDb()
    
    expect(blogAtEnds).toHaveLength(helper.initialBlog.length + 1)
    
    const allTitles = blogAtEnds.map(b => b.title)
    expect(allTitles).toContain('the art of code')
    
  })

  test('new blog have defined id field and author field', async () => {

    const newBlog = {
      title: '1 is more than 0',
      author: 'ben lawrance',
      url: 'benjamin.com'
    }
    
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body.id).toBeDefined()
    expect(response.body.author).toBeDefined()
    
  })
    
    
  test('sucess 201 new blog without defining like count', async () => {
    const newBlog = {
      title : 'Maria Me',
      author : 'david',
      url: 'game.com'
    }
    
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toEqual(0)
  })
    
    
  test('error 404 new blog without defining url', async () => {
    const newBlog = {
      title: 'Sabrrrr',
      author: 'Kin',
      likes: 17
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
    
  test('error 400 new blog without defining title', async () => {
    const newBlog = {
      author: 'Maria',
      likes: 17,
      url: 'nosirov.com'
    }
    
    await api 
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
    

})

describe('updating blog', () => {

  test('success update a valid blog post, return 200', async() => {

    const allBlogPost = await helper.blogInDb()
    const blogToUpdate = allBlogPost[0]

    const editedBlog = {
      title: 'this is edited blogs, cool!',
      author: 'tamyawan',
      url: 'dimitri.com',
      likes: 92  
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(editedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalBlogPosts = await helper.blogInDb()
    const finalTitle = finalBlogPosts[0].title
    expect(finalTitle).toEqual('this is edited blogs, cool!')


  })

})


describe('deleting blog', () => {

  test('success deleting a valid blog post, returned code 204', async() => {

    const allBlogPost = await helper.blogInDb()
    const blogToDelete = allBlogPost[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const currentBlogs = await helper.blogInDb()

    expect(currentBlogs).toHaveLength(
      helper.initialBlog.length - 1
    )

    const blogsIds = currentBlogs.map(b => b.id)

    expect(blogsIds).not.toContain(blogToDelete.id)

  })

})



afterAll(() => {
  mongoose.connection.close()
})