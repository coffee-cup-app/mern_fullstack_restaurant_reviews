//Server app
const app = require('./server.js')
//Express imports
const dotenv = require('dotenv').config()
const nodemon = require('nodemon')
const mongodb = require('mongodb')

//DAO
const RestaurantsDAO = require('./dataAccessObject/restaurantsDAO')
const ReviewsDAO = require('./dataAccessObject/reviewsDAO')

const mongoClient = mongodb.MongoClient

//Attempt to connect to mongoDB URI
mongoClient.connect(
  //DB URI
  process.env.MONGODB_URI_RESTAURANT_REVIEWS,
  {
    //Max number of connections
    maxPoolSize: 50,
    //2500 ms request timeout
    wtimeoutMS: 2500,
    //Parse mongodb connection strings
    useNewUrlParser: true
})
//Catch connection errors to DB
.catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
//Client connected to DB successfully
.then(async client => {
  //Initial reference to "restaurants" collection in database
  //Apply custom class RestaurantsDAO to filter DB queries
  await RestaurantsDAO.injectDB(client)
  await ReviewsDAO.injectDB(client)
  
  //Start node server
  app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Listening`)
  })
})