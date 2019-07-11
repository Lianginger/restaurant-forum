const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '類別名稱不存在！')
      res.redirect('back')
    } else {
      Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(() => {
          req.flash('success_messages', `類別 ${req.body.name} 更新完成！`)
          res.redirect('/admin/categories')
        })
      })
    }
  },

  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id).then(category => {
      category.destroy().then(() => {
        req.flash('success_messages', `類別 ${category.name} 刪除完成！`)
        res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = categoryController
