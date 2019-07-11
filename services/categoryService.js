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
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '類別名稱不存在！' })
    } else {
      Category.create(req.body)
        .then(category => {
          callback({
            status: 'success',
            message: `類別 ${category.name} 新增完成！`
          })
        })
        .catch(function(err) {
          // print the error details
          console.log(err)
          callback({ status: 'error', message: '類別新增失敗！' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '類別名稱不存在！' })
    } else {
      Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(() => {
          callback({
            status: 'success',
            message: `類別 ${category.name} 更新完成！`
          })
        })
      })
    }
  },

  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id).then(category => {
      if (!category) {
        callback({ status: 'error', message: '刪除類別名稱不存在！' })
      } else {
        category.destroy().then(() => {
          callback({
            status: 'success',
            message: `類別 ${category.name} 刪除完成！`
          })
        })
      }
    })
  }
}

module.exports = categoryService
