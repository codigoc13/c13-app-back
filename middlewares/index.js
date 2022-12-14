const validateArticles = require('../middlewares/validate-articles')
const validateCareers = require('../middlewares/validate-careers')
const validateCohorts = require('../middlewares/validate-cohorts')
const validateCourses = require('../middlewares/validate-courses')
const validateFields = require('../middlewares/validate-fields')
const validateFile = require('../middlewares/validate-file')
const validateJWT = require('../middlewares/validate-jwt')
const validateNovelties = require('../middlewares/validate-novelties')
const validateRoles = require('../middlewares/validate-roles')
const validateUploads = require('../middlewares/validate-uploads')
const validateUsers = require('../middlewares/validate-users')

module.exports = {
  ...validateArticles,
  ...validateCareers,
  ...validateCohorts,
  ...validateCourses,
  ...validateFields,
  ...validateFile,
  ...validateJWT,
  ...validateNovelties,
  ...validateRoles,
  ...validateUploads,
  ...validateUsers,
}
