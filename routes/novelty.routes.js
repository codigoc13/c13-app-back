const { Router } = require('express')
const { check } = require('express-validator')
const { create } = require('../controllers/novelty.controller')
const { validateJWT, isRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('title', 'El título es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    validateFields,
  ],
  create
)

module.exports = router
