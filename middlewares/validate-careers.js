const { check, body } = require('express-validator')

const { message } = require('../helpers')
const {
  careerByIdExists,
  coursesByIdsExist,
  isValidNameCareer,
} = require('../helpers/validations')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createCareerCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('name')
      .notEmpty()
      .withMessage(message.requireMale('nombre'))
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidNameCareer),

    check('description')
      .notEmpty()
      .withMessage(message.requireFemale('descripción'))
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    check('duration')
      .notEmpty()
      .withMessage(message.requireFemale('duración'))
      .if(body('description').exists())
      .isNumeric()
      .withMessage('La duración debe ser numérica'),

    check('maxCapacity')
      .notEmpty()
      .withMessage(message.requireFemale('capacidad máxima'))
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad máxima debe ser numérica'),

    check('minRequired')
      .notEmpty()
      .withMessage(message.requireMale('valor mínimo'))
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('El valor mínimo debe ser numérico'),

    check('courses').if(body('courses').exists()).custom(coursesByIdsExist),

    validateFields,
  ]
}

const updateCareerCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(careerByIdExists),

    check('name')
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidNameCareer),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser numerica'),

    check('duration')
      .if(body('duration').exists())
      .isNumeric()
      .withMessage('La duración debe ser numérica'),

    check('maxCapacity')
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad máxima debe ser numérica'),

    check('minRequired')
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('La valor mínimo debe ser numérico'),

    check('courses').if(body('courses').exists()).custom(coursesByIdsExist),

    validateFields,
  ]
}

const deleteCareerCheck = () => {
  return [
    validateJWT,

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(careerByIdExists),

    isRole('admin'),
    validateFields,
  ]
}

module.exports = {
  createCareerCheck,
  deleteCareerCheck,
  updateCareerCheck,
}
