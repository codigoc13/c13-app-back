const { Router } = require('express')
const { check } = require('express-validator')
const {
  getInvoices,
  createInvoice,
} = require('../controllers/invoice.controller')

const router = Router()

router.get('/', getInvoices)

router.post('/', createInvoice)

module.exports = router
