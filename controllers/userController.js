const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'a6377f1810d0270'

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱已註冊！')
          res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '帳號註冊成功！')
            res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    }).then(user => {
      const commentNum = user.Comments.length
      const commentRestaurantArray = user.Comments.map(comment => comment.Restaurant.name)
      const commentRestaurantNum = commentRestaurantArray.filter(onlyUnique).length
      res.render('userProfile', { userProfile: user, commentNum, commentRestaurantNum })
    })

  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      res.render('userProfileEdit', { userProfile: user })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請輸入用戶名！')
      res.redirect('back')
    } else {
      const { file } = req

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          User.findByPk(req.params.id)
            .then(user => {
              user.update(req.body)
              user.image = img.data.link
              user.save()
                .then(user => {
                  req.flash('success_messages', `用戶 ${user.name} 資料更新成功！`)
                  res.redirect(`/users/${req.params.id}`)
                })
            })
        })
      } else {
        User.findByPk(req.params.id).then(user => {
          user.update(req.body).then(() => {
            req.flash('success_messages', '用戶資料更新成功！')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      }
    }
  },

  addFavorite: async (req, res) => {
    await Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })

    res.redirect('back')
  },

  removeFavorite: async (req, res) => {
    const favorite = await Favorite.findOne({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })

    await favorite.destroy()
    res.redirect('back')
  }
}

module.exports = userController

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}