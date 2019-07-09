const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          callback({ categories, category })
        })
      } else {
        callback({ categories })
      }
    })
  }
}

module.exports = categoryService
