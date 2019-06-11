const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    Category.findAll().then(categories => {
      res.render('admin/categories', { categories })
    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '類別名稱不存在！')
      res.redirect('back')
    } else {
      Category.create(req.body)
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  }
}

module.exports = categoryController