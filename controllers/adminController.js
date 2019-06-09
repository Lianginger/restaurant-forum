const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')

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
      const { file } = req
      console.log(req.body)
      console.log(file)
      if (file) {
        fs.readFile(file.path, (err, data) => {
          if (err) console.log('Error: ', err)
          fs.writeFile(`upload/${file.originalname}`, data, () => {
            Restaurant.findByPk(req.params.id)
              .then(restaurant => {
                restaurant.update(req.body)
                restaurant.image = `/upload/${file.originalname}`
                restaurant.save()
                  .then(restaurant => {
                    req.flash('success_messages', `餐廳 ${restaurant.name} 更新成功！`)
                    res.redirect('/admin/restaurants')
                  })
              })
          })
        })
      } else {
        Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update(req.body)
              .then(restaurant => {
                req.flash('success_messages', `餐廳 ${restaurant.name} 更新成功！`)
                res.redirect('/admin/restaurants')
              })
          })

      }
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
      const { file } = req
      console.log(req.body)
      console.log(file)
      if (file) {
        fs.readFile(file.path, (err, data) => {
          if (err) console.log('Error: ', err)
          fs.writeFile(`upload/${file.originalname}`, data, () => {
            Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: `/upload/${file.originalname}`
            }).then(restaurant => {
              req.flash('success_messages', `餐廳 ${restaurant.name} 新增成功！`)
              res.redirect('/admin/restaurants')
            })
          })
        })
      } else {
        Restaurant.create(req.body)
          .then(restaurant => {
            req.flash('success_messages', `餐廳 ${restaurant.name} 新增成功！`)
            res.redirect('/admin/restaurants')
          })
      }
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