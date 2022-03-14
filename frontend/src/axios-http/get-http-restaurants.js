import axios from "axios"

const axiosHTTPGetRestaurants = axios.create({
  baseURL: "/api/restaurants",
  headers: {"Content-type": "application/json"}
})

export default axiosHTTPGetRestaurants