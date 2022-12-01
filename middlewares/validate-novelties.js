const { check, body } = require('express-validator')

const { message } = require('../helpers')
const { isValidTitle, noveltytByIdExists } = require('../helpers/validations')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('title')
      .notEmpty()
      .withMessage(message.requireMale('título'))
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringMale('título'))
      .custom(isValidTitle),

    check('description')
      .notEmpty()
      .withMessage(message.requireMale('descripción'))
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    validateFields,
  ]
}

const updateNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(noveltytByIdExists),

    check('title')
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringMale('título'))
      .custom(isValidTitle),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    validateFields,
  ]
}

const deleteNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(noveltytByIdExists),

    validateFields,
  ]
}

module.exports = {
  createNoveltyCheck,
  updateNoveltyCheck,
  deleteNoveltyCheck,
}
