const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(restaurants => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(restaurants.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => {
        return index + 1
      })
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = restaurants.rows.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(favoritedRestaurant => favoritedRestaurant.id).includes(restaurant.id),
        isLiked: req.user.LikedRestaurants.map(likedRestaurant => likedRestaurant.id).includes(restaurant.id)
      }))

      Category.findAll().then(categories => {
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(favoritedUser => favoritedUser.id).includes(req.user.id)
        const isLiked = restaurant.LikedUsers.map(likedUser => likedUser.id).includes(req.user.id)
        restaurant.viewCounts++
        restaurant.save().then(() => {
          res.render('restaurant', { restaurant, isFavorited, isLiked })
        })
      })
  },

  getTopRestaurant: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
    let resData = restaurants.map(res => ({
      ...res.dataValues,
      description: res.dataValues.description.substring(0, 30),
      favoratedUserCount: res.FavoritedUsers.length,
      isFavorited: req.user.FavoritedRestaurants.map(favoritedRestaurant => favoritedRestaurant.id).includes(res.id)
    }))
    resData = resData.sort((a, b) => { return b.favoratedUserCount - a.favoratedUserCount }).slice(0, 10)
    resData = resData.map((res, index) => ({
      ...res,
      rank: index + 1
    }))
    res.render('topRestaurant', { restaurants: resData })
  },

  getRestaurantDashboard: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' }]
    })
    const commentsNum = restaurant.Comments.length
    const favoritedNum = restaurant.FavoritedUsers.length

    res.render('dashboard', { restaurant, commentsNum, favoritedNum })
  },

  getFeeds: async (req, res) => {
    let restaurantFeeds = await Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })
    let commentFeeds = await Comment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant]
    })

    res.render('feeds', { restaurantFeeds, commentFeeds })
  }
}

module.exports = restController