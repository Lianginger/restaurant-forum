const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'a6377f1810d0270'

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },

  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      restaurant => {
        callback({ restaurant })
      }
    )
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(restaurant => {
        callback({
          status: 'success',
          message: `餐廳 ${restaurant.name} 刪除成功`
        })
      })
    })
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: '餐廳名稱不存在！' })
    } else {
      const { file } = req

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            CategoryId: parseInt(req.body.CategoryId),
            image: img.data.link
          }).then(restaurant => {
            return callback({
              status: 'success',
              message: `餐廳 ${restaurant.name} 新增成功！`
            })
          })
        })
      } else {
        Restaurant.create(req.body).then(restaurant => {
          return callback({
            status: 'success',
            message: `餐廳 ${restaurant.name} 新增成功！`
          })
        })
      }
    }
  }
}

module.exports = adminService
