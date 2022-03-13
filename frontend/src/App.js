import React from "react"
import {useState} from "react"
import {Link, useRoutes} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

//Import components
import Login from "./components/login.js"
import RestaurantCard from "./components/restaurant-card.js"
import RestaurantsList from "./components/restaurant-list.js"
import AddRestaurantReview from "./components/add-restaurant-review.js"


function App() {
  const [user, setUser] = useState(null)

  async function login(user = null) {
    if(user === null) {return}
    setUser(user)
  }

  async function logout() {
    setUser(null)
  } 

  //Routes
  const routes = useRoutes([
    { path:"/", element:<RestaurantsList /> },
    { path:"/restaurants", element:<RestaurantsList /> },
    { path:"/restaurants/:id", element:<RestaurantCard user={user} /> },
    { path:"/restaurants/:id/review", element:<AddRestaurantReview user={user} /> },
    { path:"/login", element:<Login login={login} /> }
  ])

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <h2 className="nav-title">Restaurant Reviews</h2>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/restaurants" className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" href="/#" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to="/login" className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>
      
      <div className="container mt-3">
        {routes}
      </div>
    </div>
  );
}

export default App;