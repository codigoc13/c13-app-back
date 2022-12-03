const { Router } = require('express')
const { check, body } = require('express-validator')

const { validateFields } = require('../middlewares')
const { login, googleSignIn } = require('../controllers')
const { message } = require('../helpers')

const router = Router()

router.post(
  '/login',
  [
    check('email')
      .notEmpty()
      .withMessage(message.requireMale('email'))
      .if(body('email').exists())
      .isEmail()
      .withMessage('Debe ser un email válido'),

    check('password', 'La contraseña es requerida').notEmpty(),
    validateFields,
  ],
  login
)

router.post(
  '/google',
  [
    check('id_token', 'id_token de Google es necesario').not().isEmpty(),
    validateFields,
  ],
  googleSignIn
)

module.exports = router
