const express = require('express')
const restaurants = require('./api/restaurants.route.js')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

//Routes
app.use("/api/restaurants", restaurants)

console.log('node-env', process.env.NODE_ENV)
console.log('port', process.env.PORT)

//Production check, server frontend static assets
if(process.env.NODE_ENV === 'production') {
  //React build file, must be done first before serving build index.html from public
  //Build folder with front end static assets
  app.use(express.static(path.join(__dirname, "..", "build")));
  //Serve react build file from public along with css and js
  app.use(express.static("public"));


  //Serve html file in frontend
  app.get('*', (req,res) => {
    res.sendFile((
      //__dirname -> '../' -> frontend -> build -> html
      res.sendFile(path.join(__dirname, "..", "build", "index.html"))
    ))
  })
} else {
  app.get('/', (req,res) => res.send('set process.env.NODE_ENV = production'))
}

//Route that doesn't exist
// app.use("*", (req,res) => {res.status(404).json({error: "Page not found"})})

module.exports = app