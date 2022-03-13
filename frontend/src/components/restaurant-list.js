//Imports
import React, {useState, useEffect} from "react"
import '../App.css'
//React Router
import {Link} from "react-router-dom"
//Axios HTTP class object w/ request methods to get mongodb restaurant collection data
import RestaurantDataService from "../services/getRestaurants.js"


//Get list of restaurants from backend and display them
const RestaurantsList = () => {
  //List of all restaurants from mongod db restaurant collection
  const [restaurants, setRestaurants] = useState([])
  //Queries for mongodb restaurant collection
  const [queryName, setQueryName] = useState("")
  const [queryZip, setQueryZip] = useState("")
  const [queryCuisine, setQueryCuisine] = useState("")
  //Will be a list of cuisines, so including all cuisines since it won't be pulled from db query
  const [cuisines, setCuisines] = useState([])

  //Only runs once when page is triggered after render
  useEffect(() => {
    getRestaurantsList()
    getCuisinesList()
  }, [])

  //Set queryName state on change
  const onChangeQueryName = event => {
    const qName = event.target.value
    setQueryName(qName)
  }

  //Set queryZip state on change
  const onChangeQueryZip = event => {
    const qZip = event.target.value
    setQueryZip(qZip)
  }

  //Set queryCuisine state on change
  const onChangeQueryCuisine = event => {
    const qCuisine = event.target.value
    setQueryCuisine(qCuisine)
  }

  //Get all the restaurants from mongodb collection restaurants
  const getRestaurantsList = () => {
    //Axios HTTP request to get all restaurants from mongodb restaurants collection
    //Returns a promise (Could also async await)
    RestaurantDataService.getAll()
      .then(response => {
        console.log(response.data)
        //Restaurants list returned promise data
        setRestaurants(response.data.restaurants)
      })
      .catch( err => {
        console.error(`An error occurred getting restaurant list: ${err}`)
      })
  }

  //Get all the unique cuisines from mongodb collection restaurants
  const getCuisinesList = (id) => {
    //Axios HTTP request to get all unique cuisines from mongodb restaurants collection
    //Returns a promise (Could also async await)
    RestaurantDataService.getCuisines()
      .then(
        response => {
          console.log(response.data)
          //Unique cuisines list returned promise data, merged with spread operator
          setCuisines(['All Cuisines', ...response.data])
        }
      )
      .catch(err => {
        console.error(`An error occurred getting cuisines list: ${err}`)
      })
  }

  const refreshRestaurantList = () => {
    //Component method
    getRestaurantsList()
  }

  //Get all the queried restaurants from mongodb collection restaurants
  const queryRestaurants = (query, by) => {
    //Axios HTTP request to get all queried restaurants from mongodb restaurants collection
    //Returns a promise (Could also async await)
    RestaurantDataService.find(query, by)
      .then(response => {
        console.log(response.data)
        setRestaurants(response.data.restaurants)
      })
      .catch(err => {
        console.error(`An error occurred getting queried restaurants list: ${err}`)
      })
  }

  //Query restaurants by name
  const queryByName = () => {
    queryRestaurants(queryName, "name")
  }

  //Query restaurants by zipcode
  const queryByZip = () => {
    queryRestaurants( queryZip, "zipcode")
  }

  //Query restaurants by cuisine
  const queryByCuisine = () => {  
    if(queryCuisine === "All Cuisines") {
      refreshRestaurantList()
      return
    }
    queryRestaurants(queryCuisine, "cuisine")
  }

  //Return restaurant list
  return (
    <div className="container">
      <h2>Restaurants</h2>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={queryName}
            onChange={onChangeQueryName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={queryByName}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={queryZip}
            onChange={onChangeQueryZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={queryByZip}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group col-lg-4">
          <select onChange={onChangeQueryCuisine}>
            { cuisines.map((cuisine, index) => {
                return (
                  <option key={index} value={cuisine}> {cuisine.substr(0, 20)} </option>
                )
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={queryByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {restaurants.map((restaurant, index) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card restaurant-list-card">
                <div className="card-body restaurant-card-body">
                  <h5 className="card-title">{restaurant.name}</h5>

                  <div className="card-text review-card-text">
                    <div>
                      <h6>Cuisine: </h6><p>{restaurant.cuisine}</p>
                    </div>
                    <div>
                      <h6>Address: </h6><p>{address}</p>
                    </div>
                  </div>

                  <div className="row restaurant-list-btns">
                  <Link key={index} to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RestaurantsList