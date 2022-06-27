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
        // console.log("Repsonse Data:", response.data)
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

  return (
    <div>
      {restaurantCard ? (
        <div className="restaurant-card-container">
          <h2>Reviews</h2>
          <div className='review-properties'>
            <div>
              <h6>Restaurant:</h6>
              <p>{restaurantCard.name}</p>
            </div>
            <div>
              <h6>Cuisine:</h6>
              <p>{restaurantCard.cuisine}</p>
            </div>
            <div>
              <h6>Address:</h6>
              <p>{restaurantCard.address.building} {restaurantCard.address.street}, {restaurantCard.address.zipcode}</p>
            </div>
          </div>

          <Link to={"/restaurants/" + id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          
          <div>
            {restaurantCard.reviews.length > 0 ? (
              restaurantCard.reviews.map((review, index) => {
                return (
                
                  <div className="col pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <div className="card-text review-card-text">
                          <div>
                            <h6>Review:</h6><p>{review.text}</p>
                          </div>
                          <div>
                            <h6>User:</h6><p>{review.name}</p>
                          </div>
                          <div>
                            <h6>Date:</h6><p>{review.date}</p>
                          </div>
                        </div>
                        {props.user && props.user.id === review.user_id &&
                          <div className="row review-buttons">
                            <button onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-1 mx-1 mb-1">
                              Delete
                            </button>
                            <Link
                              href=""
                              to={"/restaurants/" + id + "/review"}
                              state={{currentReview: review}}
                              className="btn btn-primary col-1 mx-1 mb-1">
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
            <div className="no-reviews col-sm-4">
              <strong>No reviews yet</strong>
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