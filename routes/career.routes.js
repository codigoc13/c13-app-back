const { Router } = require('express')

const {
  getCareers,
  createCareer,
  deleteCareer,
  updateCareer,
} = require('../controllers/career.controller')
const {
  createCareerCheck,
  updateCareerCheck,
  deleteCareerCheck,
} = require('../middlewares/validate-careers')

const router = Router()

router.post('/', createCareerCheck(), createCareer)

router.get('/', getCareers)

router.patch('/:id', updateCareerCheck(), updateCareer)

router.delete('/:id', deleteCareerCheck(), deleteCareer)

module.exports = router
