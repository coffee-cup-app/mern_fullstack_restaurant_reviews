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

//Production check, server frontend static assets
if(process.env.NODE_ENV === 'production') {
  //Build folder with front end static assets
  app.use(express.static(path.join(__dirname, "../frontend/build")))
  //Serve html file in frontend
  app.get('*', (req,res) => {
    res.sendFile((
      //__dirname -> '../' -> frontend -> build -> html
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    ))
  })
} else {
  app.get('/', (req,res) => res.send('set process.env.NODE_ENV = production'))
}

module.exports = app