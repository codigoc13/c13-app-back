const articlesValidation = require('./articles-validations')
const dbValidators = require('./db-validators')
const generateJWT = require('./generate-jwt')
const googleVerify = require('./google-verify')
const serverErrorHandler = require('./server-error-handler')
const uploadFile = require('./upload-file')
const uploadsValidations = require('./uploads-validations')
const usersValidation = require('./users-validations')
const validateObjectId = require('./validate-object-id')

module.exports = {
  ...articlesValidation,
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...serverErrorHandler,
  ...uploadFile,
  ...uploadsValidations,
  ...usersValidation,
  ...validateObjectId,
}
