const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")

// include semua route dalam controller
const userRouter = require("./controllers/user")
const blogRouter = require("./controllers/blog")
const loginRouter = require("./controllers/login")

// include middleware
const middleware = require("./utils/middleware")

// include logger untuk menampilkan pesan di console
const logger = require("./utils/logger")

// include mongoose, library bantuan untuk mongodb
const monggose = require("mongoose")

// try to connect to DB
logger.info("connecting to MongoDB...")
monggose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Successfully Connected to MongoDB!")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB", error.message)
  })

// use all necessary package
app.use(express.static("build"))
app.use(express.json())
app.use(cors())

// logger harus diatas route
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

// use route
app.use("/api/blogs", middleware.userExtractor, blogRouter) // gunakan user extraction di route blog
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

// route spesial yang hanya ada di env testing
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing")
  app.use("/api/testing", testingRouter)
}

// use middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
