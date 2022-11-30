const { check, body } = require('express-validator')

const {
  message,
  noveltytByIdExists,
  articleTitleExists,
  articleByIdExists,
} = require('../helpers')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createArticleCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('title')
      .notEmpty()
      .withMessage(message.requireTitle)
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringTitle)
      .custom(articleTitleExists),

    check('description')
      .notEmpty()
      .withMessage(message.requireDescription)
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringDescription),

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
      .custom(articleByIdExists),

    check('title')
      .if(body('title').exists())
      .isString()
      .withMessage(message.stringTitle)
      .custom(articleTitleExists),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringDescription),

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
        .custom(noveltytByIdExists),
  
      validateFields,
    ]
  }

module.exports = {
  createArticleCheck,
  updateArticleCheck,
  deleteArticleCheck,
}
