const { Router } = require('express')

const { createCohort, getCohorts, updateCohort, deleteCohort } = require('../controllers/cohort.controller')

const { createCohortCheck, updateCohortCheck , deleteCohortCheck} = require('../middlewares')

const router = Router()

router.get('/', getCohorts)

router.post('/', createCohortCheck(),createCohort)

router.patch('/:id', updateCohortCheck(), updateCohort)

router.delete('/:id', deleteCohortCheck(),deleteCohort)

module.exports = router
