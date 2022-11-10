const ReviewsDAO = require('../dataAccessObject/reviewsDAO.js')

class ReviewsController {
  //Add review (POST)
  static async apiPostReview (req,res,next) {
    try {
      //Set restaurantId to value of restaurant_id in DB collection
      const restaurantId = req.body.restaurant_id
      //Set review to value of user post
      const review = req.body.text
      //User data object
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }

      const date = new Date()

      //Set data created as params for ReviewsDAO.addReview()
      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      )

      res.json({status: "success"})
    } catch (err) {
      res.status(500).json({error: err.message})
    }
  }

  //Update review (PUT)
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id
      const text = req.body.text
      const date = new Date()

      //Set data created as params for ReviewsDAO.updateReview()
      const ReviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      )
      //Error for ReviewResponse failing
      let {error} = ReviewResponse
      if(error) {
        res.status(400).json({error})
      }

      //Review was not updated, throw error
      if(ReviewResponse.modifiedCount === 0) {
        throw new Error("Unable to update review, user may not be the original poster")
      }

      res.json({status: "success"})

    } catch (err) {
      res.status(500).json({error: err.message})
    }
  }

  //Delete review (DELETE)
  static async apiDeleteReview(req,res,next) {
    try {
      const reviewId = req.query.id
      const userId = req.body.user_id

      //Set data created as params for ReviewsDAO.deleteReview()
      const ReviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId
      )
      res.json({status: "success"})
    } catch (err) {
      res.status(500).json({error: err.message})
    }
  }

}

module.exports = ReviewsController