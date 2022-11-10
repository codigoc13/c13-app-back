const { Router } = require('express')

const { search } = require('../controllers')

const router = Router()

router.get('/:collection/:searchTerm', search)

module.exports = router
