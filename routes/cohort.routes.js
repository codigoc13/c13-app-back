const { Router } = require('express')
const { check } = require('express-validator')
const {
  createCohort,
  getCohorts,
  updateCohort,
  deleteCohort,
  search,
} = require('../controllers/cohort.controller')
const { cohortByIdExists } = require('../helpers/db-validators')
const { validateParticipants } = require('../middlewares/validate-participants')
const {
  validateFields,
  validateJWT,
  isRole,
  createCohortCheck,
  updateCohortCheck,
  deleteCohortCheck,
  getCohortCheck,
} = require('../middlewares')
const { validateCareers } = require('../middlewares/validate-careers')

const router = Router()

router.post('/', createCohortCheck(), createCohort)

router.get('/', getCohortCheck(), getCohorts)

router.patch('/:id', updateCohortCheck(), updateCohort)

router.delete('/:id', deleteCohortCheck(), deleteCohort)

router.get('/search/:term', getCohortCheck(), search)

// router.get('/search/byCourse/:term', getCohortCheck(), getCohorts)

// router.get('/search/byParticipan/:term', getCohortCheck(), getCohorts)

module.exports = router
