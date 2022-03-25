/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {

  // reset semua database
  await Blog.deleteMany({})
  await User.deleteMany({})

  //membuat user
  const userObject = helper.initialUser.map(u => new User(u))
  const promiseArrayUser = userObject.map(u => u.save())
  await Promise.all(promiseArrayUser)

  const users = await User.find({})
  const firstUserId = users[0].id

  // membuat blog post
  const blogObject = helper.initialBlog.map(b => new Blog(b))

  const promiseArrayBlog = blogObject.map(b => {
    b.user = firstUserId
    b.save()
  })

  await Promise.all(promiseArrayBlog)

})


describe('initial db value', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog have correct length amount of data', async () => {

    // ambil semua data blog
    const blogs = helper.blogInDb()

    console.log((await blogs).length)

  })
    
})




// describe('adding new blog', () => {
//   test('success adding blog, with correct body', async () => {
//     const newBlog = {
//       title: 'the art of code',
//       author: 'agung',
//       url: 'gengs.com',
//       like: 100
//     }
    
//     await api
//       .post('/api/blogs')
//       .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhbmRvIiwiaWQiOiI2MjNkOTYzMGQ3ODNiZmQ4MGE3NGQxMTciLCJpYXQiOjE2NDgyMDM1OTd9.FDoCg2vm9UXYd0B1_Cv31dPxP0MVMX8XJT981T8vaNg')
//       .send(newBlog)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
    
//     const blogAtEnds = await helper.blogInDb()
    
//     expect(blogAtEnds).toHaveLength(helper.initialBlog.length + 1)
    
//     const allTitles = blogAtEnds.map(b => b.title)
//     expect(allTitles).toContain('the art of code')
    
//   })

//   test('new blog have defined id field and author field', async () => {

//     const newBlog = {
//       title: '1 is more than 0',
//       author: 'ben lawrance',
//       url: 'benjamin.com'
//     }
    
//     const response = await api
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
    
//     expect(response.body.id).toBeDefined()
//     expect(response.body.author).toBeDefined()
    
//   })
    
    
//   test('sucess 201 new blog without defining like count', async () => {
//     const newBlog = {
//       title : 'Maria Me',
//       author : 'david',
//       url: 'game.com'
//     }
    
//     const response = await api
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
    
//     expect(response.body.likes).toBeDefined()
//     expect(response.body.likes).toEqual(0)
//   })
    
    
//   test('error 404 new blog without defining url', async () => {
//     const newBlog = {
//       title: 'Sabrrrr',
//       author: 'Kin',
//       likes: 17
//     }
    
//     await api
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(400)
//   })
    
//   test('error 400 new blog without defining title', async () => {
//     const newBlog = {
//       author: 'Maria',
//       likes: 17,
//       url: 'nosirov.com'
//     }
    
//     await api 
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(400)
//   })
    

// })

// describe('updating blog', () => {

//   test('success update a valid blog post, return 200', async() => {

//     const allBlogPost = await helper.blogInDb()
//     const blogToUpdate = allBlogPost[0]

//     const editedBlog = {
//       title: 'this is edited blogs, cool!',
//       author: 'tamyawan',
//       url: 'dimitri.com',
//       likes: 92  
//     }

//     await api
//       .put(`/api/blogs/${blogToUpdate.id}`)
//       .send(editedBlog)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     const finalBlogPosts = await helper.blogInDb()
//     const finalTitle = finalBlogPosts[0].title
//     expect(finalTitle).toEqual('this is edited blogs, cool!')


//   })

// })


// describe('deleting blog', () => {

//   test('success deleting a valid blog post, returned code 204', async() => {

//     const allBlogPost = await helper.blogInDb()
//     const blogToDelete = allBlogPost[0]

//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .expect(204)

//     const currentBlogs = await helper.blogInDb()

//     expect(currentBlogs).toHaveLength(
//       helper.initialBlog.length - 1
//     )

//     const blogsIds = currentBlogs.map(b => b.id)

//     expect(blogsIds).not.toContain(blogToDelete.id)

//   })

// })



afterAll(() => {
  mongoose.connection.close()
})