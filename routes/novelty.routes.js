const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT, isRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')
const { create, findAll } = require('../controllers/novelty.controller')

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

router.get('/', findAll)

module.exports = router
