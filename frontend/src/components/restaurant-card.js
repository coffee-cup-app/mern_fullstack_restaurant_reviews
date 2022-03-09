import React, {useState, useEffect} from "react"
import RestaurantDataService from "../services/getRestaurants.js"
import {Link, useParams} from "react-router-dom"

const RestaurantCard = (props) => {
  //Initial object data for useState variable restaurantCard
  const initRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  }

  //UseState variables
  const [restaurantCard, setRestaurantCard] = useState(initRestaurantState)

  //Route param :id (restaurant_id)
  let {id} = useParams()

  //Get a restaurant card by id from mongodb collection restaurants
  const getRestaurantCard = (id) => {
    RestaurantDataService.get(id)
      .then(response => {
        console.log("Repsonse Data:", response.data)
        //Destructure key/values from response.data and update the initRestaurantState
        const {_id, name, address, cuisine, reviews} = response.data
        setRestaurantCard({
          id: _id,
          name: name,
          address: address,
          cuisine: cuisine,
          reviews: reviews
        })
      })
      .catch(err => {
        console.error(`An error occurred getting the restaurant card by id: ${err}`)
      })
  }
  
  //When the page first renders and when the state of id changes
  useEffect(() => {
    getRestaurantCard(id)
  }, [id])

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setRestaurantCard(prevState => {
          prevState.reviews.splice(index, 1)
          return({...prevState})
        })
      })
      .catch(err => {
        console.error(`An error occurred deleting the restaurant card by id: ${err}`)
      })
  }

  console.log("PARAMS:", id)
  console.log("props", props)
  console.log("restaurantCardState", restaurantCard)

  return (
    <div>
      {restaurantCard ? (
        <div>
          <h5>{restaurantCard.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurantCard.cuisine}<br/>
            <strong>Address: </strong>{restaurantCard.address.building} {restaurantCard.address.street}, {restaurantCard.address.zipcode}
          </p>
          <Link to={"/restaurants/" + id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurantCard.reviews.length > 0 ? (
              restaurantCard.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}<br/>
                          <strong>User: </strong>{review.name}<br/>
                          <strong>Date: </strong>{review.date}
                        </p>
                        {props.user && props.user.id === review.user_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link
                              href=""
                              to={"/restaurants/" + id + "/review"}
                              state={{currentReview: review}}
                              className="btn btn-primary col-lg-5 mx-1 mb-1">
                              Edit
                            </Link>
                          </div>                   
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantCard