const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      res.render('admin/restaurants', { restaurants })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        res.render('admin/restaurant', { restaurant })
      })
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        res.render('admin/create', { restaurant })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名稱不存在！')
      res.redirect('back')
    } else {
      Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update(req.body)
        })
        .then(restaurant => {
          req.flash('success_messages', '更新成功！')
          res.redirect('/admin/restaurants')
        })
    }
  },

  createRestaurant: (req, res) => {
    res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名稱不存在！')
      res.redirect('back')
    } else {
      Restaurant.create(req.body)
        .then(restaurant => {
          req.flash('success_messages', `餐廳 ${restaurant.name} 新增成功！`)
          res.redirect('/admin/restaurants')
        })
    }
  },
  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            req.flash('success_messages', `餐廳 ${restaurant.name} 刪除成功！`)
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController