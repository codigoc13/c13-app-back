const authArticler = require('./article.controller')
const authController = require('./auth.controller')
const careerController = require('./career.controller')
const cohortController = require('./cohort.controller')
const courseController = require('./course.controller')
const searchController = require('./search.controller')
const uploadController = require('./upload.controller')

module.exports = {
  ...authArticler,
  ...authController,
  ...careerController,
  ...cohortController,
  ...courseController,
  ...searchController,
  ...uploadController,
}
