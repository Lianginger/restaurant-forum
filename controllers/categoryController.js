const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            res.render('admin/categories', { categories, category })
          })
      } else {
        res.render('admin/categories', { categories })
      }
    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '類別名稱不存在！')
      res.redirect('back')
    } else {
      Category.create(req.body)
        .then(category => {
          req.flash('success_messages', `類別 ${req.body.name} 新增完成！`)
          res.redirect('/admin/categories')
        })
        .catch(function (err) {
          // print the error details
          console.log(err)
        })
    }
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '類別名稱不存在！')
      res.redirect('back')
    } else {
      Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
            .then(() => {
              req.flash('success_messages', `類別 ${req.body.name} 更新完成！`)
              res.redirect('/admin/categories')
            })
        })
    }
  },

  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy().then(() => {
          req.flash('success_messages', `類別 ${category.name} 刪除完成！`)
          res.redirect('/admin/categories')
        })
      })
  }
}

module.exports = categoryController