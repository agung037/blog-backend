const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}


const totalLike = (blogs) => {
    const likesArr = blogs.map(blog => blog.likes)
    return likesArr.reduce((a, b) => a + b, 0)
}


const favoriteBlog = (blog) => {

    if (blog.length === 0){
        return {}
    }

    const mostLikeValue = Math.max.apply(Math, blog.map(x => x.likes))
    const result = blog.find(x => x.likes === mostLikeValue )
    
    return {
      "title" : result.title,
      "author": result.author,
      "likes": result.likes
    }
}

const mostProductiveAuthor = (arr) => {
    const authors = arr.map(blog => blog.author)
  
    const author = _.head(_(authors)
                  .countBy()
                  .entries()
                  .maxBy(_.last));
  
    const totalBlogs = authors.filter(name => name === author).length
  
    return {
      'author': author,
      'blogs': totalBlogs
    }
  
  }

module.exports = {
    dummy, 
    totalLike,
    favoriteBlog,
    mostProductiveAuthor
};
