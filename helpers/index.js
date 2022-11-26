const dbarticlesValidation = require('./db-articles-validations')

const dbValidators = require('./db-validators')
const generateJWT = require('./generate-jwt')
const googleVerify = require('./google-verify')
const validateObjectId = require('./validate-object-id')
const uploadFile = require('./upload-file')
const serverErrorHandler = require('./server-error-handler')

module.exports = {
  ...dbarticlesValidation,
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...validateObjectId,
  ...uploadFile,
  ...serverErrorHandler,
}
