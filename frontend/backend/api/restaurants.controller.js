const RestuarantsDAO = require("../dataAccessObject/restaurantsDAO.js")

class RestaurantsController {

  static async apiGetRestaurants(req, res, next){ 
    //Check if "restaurantPerPage" exists in url
    const restaurantPerPage = req.query.restaurantPerPage ? parseInt(req.query.restaurantPerPage, 10) : 20
    //Check if "page" exists in url
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    
    if(req.query.cuisine) {
      //If cuisine filter exists in query, add cuisine+value to filters object
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      //If zipcode filter exists in query, add zipcode+value to filters object
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
       //If name filter exists in query, add name+value to filters object
      filters.name = req.query.name
    }

    const { restaurantsList, totalNumRestaurants } = await RestuarantsDAO.getRestaurants({
      filters,
      page,
      restaurantPerPage
    })

    //Response Object with filter data of query
    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantPerPage,
      total_results: totalNumRestaurants,
    }

    //Response
    res.json(response)
  }

  static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {}
      //Get restaurant by id from DB
      let restaurant = await RestuarantsDAO.getRestaurantById(id)
      if(!restaurant) {
        //Page not found
        res.status(404).json({error:"Page not found"})
        return
      }
      res.json(restaurant)
      } catch (err) {
        console.error(`api: ${err}`)
        //Internal server error
        res.status(500).json({error: err})
      }
    }

  static async apiGetRestaurantCuisines (req, res, next) {
    try {
      //Get cuisines from DB
      let cuisines = await RestuarantsDAO.getCuisines()
      res.json(cuisines)
    } catch (err) {
      console.error(`api: ${err}`)
      //Internal server error
      res.status(500).json({error: err})
    }
  }
}

module.exports = RestaurantsController