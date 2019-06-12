const db = require('../models')
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    if (!req.body.text) {
      req.flash('error_messages', '評論沒有內容！')
      res.redirect('back')
    } else {
      Comment.create(req.body)
        .then(() => {
          req.flash('success_messages', '新增評論成功！')
          res.redirect(`/restaurants/${req.body.RestaurantId}`)
        })
    }
  },

  deleteComment: (req, res) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(comment => {
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
}

module.exports = commentController