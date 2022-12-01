const { check, body } = require('express-validator')

const { message } = require('../helpers')
const {
  articleByIdExists,
  articleTitleExists,
} = require('../helpers/validations')

const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createArticleCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('title')
      .notEmpty()
      .withMessage(message.requireMale('título'))
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringMale('título'))
      .custom(articleTitleExists),

    check('description')
      .notEmpty()
      .withMessage(message.requireFemale('descripción'))
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    validateFields,
  ]
}

const updateArticleCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .if(body('id').isMongoId())
      .custom(articleByIdExists),

    check('title')
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringMale('título'))
      .custom(articleTitleExists),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    validateFields,
  ]
}

const deleteArticleCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .if(body('id').isMongoId())
      .custom(articleByIdExists),

    validateFields,
  ]
}

module.exports = {
  createArticleCheck,
  updateArticleCheck,
  deleteArticleCheck,
}
