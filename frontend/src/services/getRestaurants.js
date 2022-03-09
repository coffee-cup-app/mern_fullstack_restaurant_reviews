//Axios create object for HTTP requests
import axiosHTTP from "../axios-http/get-http-restaurants.js"

//Request restaurant data based on routes
class RestaurantDataService {

  //If no page passed then first page requested
  getAll(page=0) {
    //Request to get specific page from mongodb restaurants collection using a query
    return axiosHTTP.get(`?page=${page}`)
  }

  //Get restaurant by id from mongodb restaurants collection using a param variable id
  get(id) {
    return axiosHTTP.get(`/id/${id}`)
  }

  //find restaurant by name from mongodb restaurants collection using a query
  find(query, by='name', page=0) {
    return axiosHTTP.get(`?${by}=${query}&page=${page}`)
  }

  //Create a review and post to backend mongodb collection reviews
  createReview(data) {
    return axiosHTTP.post("/review", data)
  }

  //Update a review and put to backend mongodb collection reviews
  updateReview(data) {
    return axiosHTTP.put("/review", data)
  }

  //Delete a review in the backend mongodb collection reviews using the query variable id
  deleteReview(id, userId) {
    return axiosHTTP.delete(`/review?id=${id}`, {data: {user_id: userId} })
  }

  //Send a request to get a list of all unique cuisines from mongodb restaurants collection
  getCuisines(id) {
    return axiosHTTP.get(`/cuisines`)
  }
}

export default new RestaurantDataService()