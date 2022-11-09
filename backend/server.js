const express = require('express')
const restaurants = require('./api/restaurants.route.js')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

//Routes
app.use("/api/restaurants", restaurants)

//Production check, server frontend static assets
if(process.env.NODE_ENV === 'production') {
  //Build folder with front end static assets
  app.use(express.static(path.join(__dirname, "/build")))
  //Serve html file in frontend
  app.get('*', (req,res) => {
    res.sendFile((
      //__dirname -> '../' -> frontend -> build -> html
      path.resolve('index.html', { root: __dirname })
    ))
  })
} else {
  app.get('/', (req,res) => res.send('set process.env.NODE_ENV = production'))
}

//Route that doesn't exist
// app.use("*", (req,res) => {res.status(404).json({error: "Page not found"})})

module.exports = app