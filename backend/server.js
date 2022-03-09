const express = require('express')
const cors = require('cors')
const restaurants = require('./api/restaurants.route.js')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

//Routes
app.use("/api/restaurants", restaurants)

//Route that doesn't exist
app.use("*", (req,res) => {res.status(404).json({error: "Page not found"})})

module.exports = app