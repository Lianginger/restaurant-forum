const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      res.render('admin/restaurants', { restaurants })
    })
  }
}

module.exports = adminController