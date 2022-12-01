const articlesValidation = require('./articles-validations')
const coursesValidations = require('./courses-validations')
const dbValidators = require('./db-validators')
const generateJWT = require('./generate-jwt')
const googleVerify = require('./google-verify')
const messages = require('./messages')
const noveltiesValidations = require('./novelties-validations')
const serverErrorHandler = require('./server-error-handler')
const uploadFile = require('./upload-file')
const uploadsValidations = require('./uploads-validations')
const usersValidation = require('./users-validations')
const validateObjectId = require('./validate-object-id')

module.exports = {
  ...articlesValidation,
  ...coursesValidations,
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...messages,
  ...noveltiesValidations,
  ...serverErrorHandler,
  ...uploadFile,
  ...uploadsValidations,
  ...usersValidation,
  ...validateObjectId,
}
