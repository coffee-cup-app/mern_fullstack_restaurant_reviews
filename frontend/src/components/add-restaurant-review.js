import React, {useState} from "react"
import RestaurantDataService from "../services/getRestaurants.js"
import {Link, useParams, useLocation} from "react-router-dom"

//Add and edit restaurant reviews from this page
const AddRestaurantReview = (props) => {
  let initReviewState = ""
  let editing = false

  //Raact Router param :id (restaurant_id)
  const {id} = useParams()
  //React Router state location prop passed from react router component <Link to="" /> in restaurant-card.js
  let {state} = useLocation()

  //Check if state exists in prop passed from react router component <Link to="" /> in restaurant-card.js
  if (state && state.currentReview) {
    //If the review state exists enable editing
    editing = true
    initReviewState = state.currentReview.text
  }

  //useState variables
  const [review, setReview] = useState(initReviewState)
  const [submitted, setSubmitted] = useState(false)

  //Event handler to get id value
  const handleInputChange = (event) => {
    setReview(event.target.value)
  }

  //Save review from form in a json format
  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: id
    };

    //If a review exists, editing = true
    if (editing) {

      //Data passed as props from the <Link to="" /> component from react router in
      data.review_id = state.currentReview._id

      //Saved review data in json format "PUT" to server to update review
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          // console.log(response.data);
        })
        .catch(err => {
          console.error(`An error occurred updating the review: ${err}`);
        })
    } else {
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          // console.log(response.data);
        })
        .catch(err => {
          console.log(`An error occurred creating the review: ${err}`);
        });
    }
  }

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group add-review">
              <label htmlFor="description"><h2>{ editing ? "Edit" : "Create" } Review</h2></label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
      ) : (
      <div>
        <h2>Please log in</h2>
      </div>
      )}
    </div>
  )
}

export default AddRestaurantReview