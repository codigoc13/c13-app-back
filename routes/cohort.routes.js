const { Router } = require('express')

const {
  createCohort,
  deleteCohort,
  getCohorts,
  search,
  searchByEntities,
  updateCohort,
} = require('../controllers/cohort.controller')
const {
  createCohortCheck,
  deleteCohortCheck,
  getCohortCheck,
  updateCohortCheck,
} = require('../middlewares')

const router = Router()

router.post('/', createCohortCheck(), createCohort)

router.get('/', getCohortCheck(), getCohorts)

router.patch('/:id', updateCohortCheck(), updateCohort)

router.delete('/:id', deleteCohortCheck(), deleteCohort)

router.get('/search/:term', getCohortCheck(), search)

router.get('/search/byEntities/:term', getCohortCheck(), searchByEntities)

module.exports = router
