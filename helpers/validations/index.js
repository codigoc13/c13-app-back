const articlesValidation = require('./articles-validations')
const noveltiesValidations = require('./novelties-validations')
const uploadsValidations = require('./uploads-validations')
const usersValidation = require('./users-validations')

module.exports = {
  ...articlesValidation,
  ...noveltiesValidations,
  ...uploadsValidations,
  ...usersValidation,
}
