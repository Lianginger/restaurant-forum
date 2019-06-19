const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
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
      include: [
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      const followerNum = user.Followers.length
      const followingNum = user.Followings.length
      const favoritedRestaurantNum = user.FavoritedRestaurants.length
      const commentNum = user.Comments.length
      const commentRestaurantArray = user.Comments.map(comment => comment.Restaurant.name)
      const commentRestaurantNum = commentRestaurantArray.filter(onlyUnique).length
      res.render('userProfile', {
        userProfile: user,
        commentNum,
        commentRestaurantNum,
        followerNum,
        followingNum,
        favoritedRestaurantNum
      })
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
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })

    await favorite.destroy()
    res.redirect('back')
  },

  addLike: async (req, res) => {
    await Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })

    res.redirect('back')
  },

  removeLike: async (req, res) => {
    const like = await Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })

    await like.destroy()
    res.redirect('back')
  },

  getTopUser: async (req, res) => {
    const users = await User.findAll({
      include: [{
        model: User, as: 'Followers'
      }]
    })

    let userDatas = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      // 判斷目前登入使用者是否已追蹤該 User 物件
      isFollowed: req.user.Followings.map(following => following.id).includes(user.id)
    }))

    userDatas = userDatas.sort((a, b) => { return b.FollowerCount - a.FollowerCount })
    res.render('topUser', { users: userDatas })
  },

  addFollowing: async (req, res) => {
    await Followship.create(req.body)
    res.redirect('back')
  },

  removeFollowing: async (req, res) => {
    const followshipRecord = await Followship.findOne({ where: req.body })
    await followshipRecord.destroy()
    res.redirect('back')
  }
}

module.exports = userController

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}