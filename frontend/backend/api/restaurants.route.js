const express = require('express')
//Controllers
const RestaurantsController = require("./restaurants.controller.js")
const ReviewsController = require("./reviews.controller.js")
//Create express router
const router = express.Router()

//Routes
router.route("/").get(RestaurantsController.apiGetRestaurants)

router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById)

router.route("/cuisines").get(RestaurantsController.apiGetRestaurantCuisines)

router.route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

module.exports = router