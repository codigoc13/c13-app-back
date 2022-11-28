const authArticler = require('./article.controller')
const authController = require('./auth.controller')
const careerController = require('./career.controller')
const categoryController = require('./category.controller')
const cohortController = require('./cohort.controller')
const courseController = require('./course.controller')
const invoiceController = require('./invoice.controller')
const noveltyController = require('./novelty.controller')
const productController = require('./product.controller')
const searchController = require('./search.controller')
const uploadController = require('./upload.controller')
const userController = require('./user.controller')

module.exports = {
  ...authArticler,
  ...authController,
  ...careerController,
  ...categoryController,
  ...cohortController,
  ...courseController,
  ...invoiceController,
  ...noveltyController,
  ...productController,
  ...searchController,
  ...uploadController,
  ...userController,
}
