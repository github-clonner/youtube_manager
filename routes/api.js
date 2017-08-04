var express = require('express')
var router = express.Router()

router.get('/subscriptions', function (req, res, next) {
  res.end('subscriptions')
})

module.exports = router
