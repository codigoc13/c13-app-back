const { Router } = require('express')

const { updateImg } = require('../controllers')
const { updateImgcheck } = require('../middlewares')

const router = Router()

router.patch('/:collection/:id', updateImgcheck(), updateImg)

module.exports = router
