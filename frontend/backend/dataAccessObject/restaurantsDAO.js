const mongodb = require("mongodb")
const ObjectId = mongodb.ObjectId

let restaurants

class RestaurantsDAO {
  //Try to connect to DB
  static async injectDB(conn) {
    //Restuarants is connected already
    if(restaurants) {
      return
    }
    try {
      //Restaurants is not connected, try to connect
      restaurants = await conn.db(process.env.RESTAURANT_REVIEWS_NS).collection("restaurants")
    } catch (err) {
      console.error(`Unable to establish a connection to db collection in restaurants DAO: ${err}`)
    }
  }

  //Custom method to filter restaurant search: parameter defaults to empty {}
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage= 20
  } = {}) {
    let query
    //If filters applied through parameters exist
    if(filters) {
      //Queries w/ filters applied
      if("name" in filters) {
        //$text, DB field changed in mongo atlas
        query = {$text: {$search: filters["name"]}}
      } else if ("cuisine" in filters) {
        //DB field "cuisine" = filters["parameter value"]
        query = {"cuisine": {$eq: filters["cuisine"]}}
      } else if ("zipcode" in filters) {
        //DB field "address.zipcode" = filters["parameter value"]
        query = {"address.zipcode": {$eq: filters["zipcode"]}}
      }
    }

    //Hold query object
    let cursor

    try {
      //Search with query established with class method: getRestaurants()
      cursor = await restaurants.find(query)
    } catch (err) {
      console.error(`Unable to find match for query: ${err}`)
      //Return empty list of restaurants for errored query
      return  {restaurantsList: [], totalNumRestaurants: 0 }
    }

    //Query exists, limit results of the query
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage*page)

    try{
      //Convert restaurant list to an array
      const restaurantsList = await displayCursor.toArray()
      //Total number of restuarants found from query
      const totalNumRestaurants = await restaurants.countDocuments(query)

      return { restaurantsList, totalNumRestaurants }
    } catch (err) {
      console.error(`Unable to create array from query data, or problem counting documents: ${err} `)
      //Return empty list of restaurants for errored query
      return  {restaurantsList: [], totalNumRestaurants: 0 }
    }
  }

  //Get reviews from DB review collection and add it to the restaurant collection by id
  static async getRestaurantById(id) {
    try {
      //Match id of restaurant with reviews pertaining to the restaurant id
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            //Add new field called review to restaurant collection
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ]
      //Return the restaurants collection with the merged reviews added
      return await restaurants.aggregate(pipeline).next()
    } catch (err) {
      console.error(`Something went wrong in getRestaurantById: ${err}`)
      throw new Error(`Failed to merge documents: ${err}`)
    }
  }

  //Get resturant cuisine types from DB restaurant collection, use for front-end
  static async getCuisines() {
    let cuisines = []
    try {
      //Store cuisine types after finding each unique cuisine in the DB restaurant collection
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (err) {
      console.error(`Unable to get cuisines: ${err}`)
      return cuisines
    }
  }
}

module.exports = RestaurantsDAO