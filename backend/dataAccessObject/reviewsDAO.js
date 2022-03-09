
const mongodb = require("mongodb")
const ObjectId = mongodb.ObjectId

let reviews

class ReviewsDAO {
  //Try to connect to DB
  static async injectDB(conn) {
    //If it exists return
    if(reviews) {
      return
    }
    try {
      //If collection doesn't exist in mongodb it will create the collection
      reviews = await conn.db(process.env.RESTAURANT_REVIEWS_NS).collection("reviews")
    } catch (err) {
      console.error(`Unable to connect to collection "reviews" from db: ${err}`)
    }
  }

  //Add review to DB after successful connection
  static async addReview(restaurantId, user, review, date) {
    try {
      //Create a review document
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        //Converted to mongodb ObjectId
        restaurant_id: ObjectId(restaurantId)
      }
      //Add created review document to DB
      return await reviews.insertOne(reviewDoc)
    } catch (err) {
      console.error(`Unable to post review: ${err}`)
      return {error: err}
    }
  }
  
  //Update review to DB after successful connection
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        //Filter (param 1)
        {user_id: userId, _id: ObjectId(reviewId)},
        //Update (param 2)
        {$set: {text: text, date: date}}
      )
      return updateResponse
    } catch (err) {
      console.error(`Unable to update review: ${err}`)
      return {error: err}
    }
  }

  //Delete review to DB after successful connection
  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne(
        //Delete (param 1)
        {_id: ObjectId(reviewId), user_id: userId }
      )
      return deleteResponse
    } catch (err) {
      console.error(`Unable to delete review: ${err}`)
      return {error: err}
    }
  }
}

module.exports = ReviewsDAO