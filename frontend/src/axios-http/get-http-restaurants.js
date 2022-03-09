import axios from "axios"

const axiosHTTPGetRestaurants = axios.create({
  baseURL: "http://localhost:5000/api/restaurants",
  headers: {"Content-type": "application/json"}
})

export default axiosHTTPGetRestaurants