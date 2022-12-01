const articlesValidations = require('./articles-validations')
const careersValidations = require('./careers-validations')
const coursesValidations = require('./courses-validations')
const noveltiesValidations = require('./novelties-validations')
const uploadsValidations = require('./uploads-validations')
const usersValidations = require('./users-validations')

module.exports = {
  ...articlesValidations,
  ...careersValidations,
  ...coursesValidations,
  ...noveltiesValidations,
  ...uploadsValidations,
  ...usersValidations,
}
