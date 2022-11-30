const { check, body } = require('express-validator')

const {
  isValidEmail,
  isValidRole,
  isValidUsername,
  userByIdExists,
  message,
} = require('../helpers')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')
const { isRole } = require('./validate-roles')

const createUserCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('firstName')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .if(body('firstName').exists())
      .isString()
      .withMessage('El nombre debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El nombre debe contener mínimo de 3 caracteres'),

    check('lastName')
      .notEmpty()
      .withMessage('El apellido es requerido')
      .if(body('lastName').exists())
      .isString()
      .withMessage('El apellido debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El apellido debe contener mínimo de 3 caracteres'),

    check('username')
      .notEmpty()
      .withMessage('El nombre de usuario es requerido')
      .if(body('username').exists())
      .isString()
      .withMessage('El nombre de usuario debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El nombre de usuario debe contener mínimo de 3 caracteres')
      .custom(isValidUsername),

    check('typeDocument')
      .notEmpty()
      .withMessage('El tipo de documento es requerido')
      .if(body('typeDocument').exists())
      .isIn(['c.c', 't.i'])
      .withMessage(
        `El tipo de documento no es permitido, debe ser: 'c.c' o 't.i'`
      ),

    // FIXME: Validar que solo se pueda ingresar un string de números.

    check('numberDocument')
      .notEmpty()
      .withMessage('El número de documento es requerido'),

    check('address')
      .if(body('address').exists())
      .isString()
      .withMessage('La dirección debe ser una cadena de caracteres')
      .isLength({ min: 6 })
      .withMessage('La dirección debe ser mínimo de 6 caracteres'),

    // FIXME: Validar con máscara los números telefónicos en el array
    check('phoneNumbers')
      .if(body('phoneNumbers').exists())
      .isArray({ min: 1 })
      .withMessage(
        'Los números de teléfono deben ser una lista de caracteres numéricos con mínimo un teléfon válido'
      ),
    check('phoneNumbers.*')
      .if(body('phoneNumbers.*').exists())
      .isString()
      .withMessage(
        'El número de teléfono debe ser una cadena de caracteres numéricos'
      ),

    check('email')
      .notEmpty()
      .withMessage('El email es requerido')
      .if(body('email').exists())
      .isEmail()
      .withMessage('El email debe ser válido (@-.com, etc)')
      .custom(isValidEmail),

    check('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .if(body('password').exists())
      .isLength({ min: 6 })
      .withMessage('La contraseña debe ser mínimo de 6 caracteres'),

    check('role')
      .notEmpty()
      .withMessage('El rol es obligatorio')
      .if(body('role').exists())
      .custom(isValidRole),

    validateFields,
  ]
}

const getUsersCheck = () => {
  return [validateJWT, isRole('admin'), validateFields]
}

const updateUserCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(userByIdExists),

    check('firstName')
      .if(body('firstName').exists())
      .isString()
      .withMessage('El nombre debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El nombre debe contener mínimo de 3 caracteres'),

    check('lastName')
      .if(body('lastName').exists())
      .isString()
      .withMessage('El apellido debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El apellido debe contener mínimo de 3 caracteres'),

    check('username')
      .if(body('username').exists())
      .isString()
      .withMessage('El nombre de usuario debe ser una cadena de caracteres')
      .isLength({ min: 3 })
      .withMessage('El nombre de usuario debe contener mínimo de 3 caracteres')
      .custom(isValidUsername),

    check('typeDocument')
      .if(body('typeDocument').exists())
      .isIn(['c.c', 't.i'])
      .withMessage(
        `El tipo de documento no es permitido, debe ser: 'c.c' o 't.i'`
      ),

    // FIXME: Validar que solo se pueda ingresar un string de números en el campor numberDocument.

    check('address')
      .if(body('address').exists())
      .isString()
      .withMessage('La dirección debe ser una cadena de caracteres')
      .isLength({ min: 6 })
      .withMessage('La dirección debe ser mínimo de 6 caracteres'),

    // FIXME: Validar con máscara los números telefónicos en el array
    check('phoneNumbers')
      .if(body('phoneNumbers').exists())
      .isArray({ min: 1 })
      .withMessage(
        'Los números de teléfono deben ser una lista de caracteres numéricos con mínimo un teléfon válido'
      ),
    check('phoneNumbers.*')
      .if(body('phoneNumbers.*').exists())
      .isString()
      .withMessage(
        'El número de teléfono debe ser una cadena de caracteres numéricos'
      ),

    check('email')
      .if(body('email').exists())
      .isEmail()
      .withMessage('El email debe ser válido (@-.com, etc)')
      .custom(isValidEmail),

    check('password')
      .if(body('password').exists())
      .isLength({ min: 6 })
      .withMessage('La contraseña debe ser mínimo de 6 caracteres'),

    check('role').if(body('role').exists()).custom(isValidRole),

    validateFields,
  ]
}

const deleteUserCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage('El ID no es válido')
      .custom(userByIdExists),

    validateFields,
  ]
}

module.exports = {
  createUserCheck,
  deleteUserCheck,
  getUsersCheck,
  updateUserCheck,
}
