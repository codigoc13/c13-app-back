const validateFields = require('../middlewares/validate-fields')
const validateFile = require('../middlewares/validate-file')
const validateJwt = require('../middlewares/validate-jwt')
const validateJWT = require('../middlewares/validate-jwt')
const validateRoles = require('../middlewares/validate-roles')
const validateUploads = require('../middlewares/validate-uploads')
const validateUsers = require('../middlewares/validate-users')

module.exports = {
  ...validateFields,
  ...validateFile,
  ...validateJwt,
  ...validateJWT,
  ...validateRoles,
  ...validateUploads,
  ...validateUsers,
}
