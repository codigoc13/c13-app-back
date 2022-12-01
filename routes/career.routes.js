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

router.get('/', updateCareerCheck(), getCareers)

router.patch('/:id', updateCareer)

router.delete('/:id', deleteCareerCheck(), deleteCareer)

module.exports = router
