const articlesValidation = require('./articles-validations')
const coursesValidation = require('./courses-validations')
const noveltiesValidations = require('./novelties-validations')
const uploadsValidations = require('./uploads-validations')
const usersValidation = require('./users-validations')

module.exports = {
  ...articlesValidation,
  ...coursesValidation,
  ...noveltiesValidations,
  ...uploadsValidations,
  ...usersValidation,
}
