import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../App.css'

const Login = (props) => {
  //React router navigate hook used in login for redirect to "/"
  let navigate = useNavigate()

  //Object used to initialize useState variable user
  const initUserState = {
    name: "",
    id: ""
  }
  
  //useState variables
  const [user, setUser] = useState(initUserState)
  
  //Input on change for login form
  const handleInputChange = (event) => {
    const {name, value} = event.target
    setUser({...user, [name]: value})
  }

  //Set app.js method login with useState variable user
  const login = () => {
    //Passed function login from app.js to set the user
    props.login(user)
    //Navigate to "/" (react router hook)
    navigate('/restaurants')
  }

  return (
    <div className="submit-form">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="user">Username</label>
        <input
          type="text"
          className="form-control"
          id="name"
          required
          value={user.name}
          onChange={handleInputChange}
          name="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="id">ID</label>
        <input
          type="text"
          className="form-control"
          id="id"
          required
          value={user.id}
          onChange={handleInputChange}
          name="id"
        />
      </div>

      <button onClick={login} className="btn btn-success">
        Login
      </button>
    </div>
  )
}

export default Login;