const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).fromNow()
  },

  ifCommentNumBiggerThanTwo: function (commentNum, options) {
    if (parseInt(commentNum) > 2) {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}