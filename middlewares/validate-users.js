const { check, body } = require('express-validator')

const { message } = require('../helpers')
const {
  isValidEmail,
  isValidUsername,
  userByIdExists,
  isValidRole,
  isValidNumberDocument,
} = require('../helpers/validations')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')
const { isRole, isRoleOrOwner } = require('./validate-roles')

const createUserCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('firstName')
      .notEmpty()
      .withMessage(message.requireMale('nombre'))
      .if(body('firstName').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .isLength({ min: 3 })
      .withMessage(message.lengthMale('nombre', 3)),

    check('lastName')
      .notEmpty()
      .withMessage(message.requireMale('apellido'))
      .if(body('lastName').exists())
      .isString()
      .withMessage(message.stringMale('apellido'))
      .isLength({ min: 3 })
      .withMessage(message.lengthMale('apellido', 3)),

    check('username')
      .notEmpty()
      .withMessage(message.requireMale('username'))
      .if(body('username').exists())
      .isString()
      .withMessage(message.stringMale('username'))
      .isLength({ min: 3 })
      .withMessage(message.lengthMale('username', 3))
      .custom(isValidUsername),

    check('typeDocument')
      .notEmpty()
      .withMessage(message.requireMale('tipo de documento'))
      .if(body('typeDocument').exists())
      .isIn(['c.c', 't.i'])
      .withMessage(
        `El tipo de documento no es permitido, debe ser: 'c.c' o 't.i'`
      ),

    // FIXME: Validar que solo se pueda ingresar un string de números.
    check('numberDocument')
      .notEmpty()
      .withMessage(message.requireMale('número de documento'))
      .if(body('numberDocument').exists())
      .custom(isValidNumberDocument),

    check('address')
      .if(body('address').exists())
      .isString()
      .withMessage(message.requireFemale('dirección'))
      .isLength({ min: 6 })
      .withMessage(message.lengthMale('dirección', 3)),

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
      .withMessage(message.requireMale('email'))
      .if(body('email').exists())
      .isEmail()
      .withMessage('El email debe ser válido (@-.com, etc)')
      .custom(isValidEmail),

    check('password')
      .notEmpty()
      .withMessage(message.requireFemale('contraseña'))
      .if(body('password').exists())
      .isLength({ min: 6 })
      .withMessage(message.lengthFemale('contraseña', 6)),

    check('role')
      .notEmpty()
      .withMessage(message.requireFemale('role'))
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
    check('numberDocument')
      .if(body('numberDocument').exists())
      .custom(isValidNumberDocument),

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
      .withMessage(message.idIsNotValid)
      .custom(userByIdExists),

    validateFields,
  ]
}

const searchUserByIdCheck = () => {
  return [
    validateJWT,

    isRoleOrOwner('admin'),

    check('id').isMongoId().withMessage(message.idIsNotValid),

    validateFields,
  ]
}

const searchUsersCheck = () => {
  return [validateJWT, isRole('admin'), validateFields]
}

module.exports = {
  createUserCheck,
  deleteUserCheck,
  getUsersCheck,
  searchUserByIdCheck,
  searchUsersCheck,
  updateUserCheck,
}
