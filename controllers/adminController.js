const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'a6377f1810d0270'
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      res.render('admin/restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        res.render('admin/create', { restaurant, categories })
      })
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data.message)
        res.redirect('/admin/restaurants')
      }
    })
  },

  editUser: (req, res) => {
    User.findAll().then(users => {
      res.render('admin/users', { users })
    })
  },

  putUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      const updatedAdmin = !user.isAdmin
      const text = user.isAdmin ? 'user' : 'admin'
      req.flash(
        'success_messages',
        `使用者：${user.name} 權限更新成 ${text} 成功！`
      )
      user.isAdmin = updatedAdmin
      user.save().then(res.redirect('/admin/users'))
    })
  }
}

module.exports = adminController
