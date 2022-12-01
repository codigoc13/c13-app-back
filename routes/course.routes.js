const { Router } = require('express')

const {
  createCourseCheck,
  updateCourseCheck,
  deleteCourseCheck,
} = require('../middlewares')
const {
  create,
  findAll,
  deleteById,
  update,
} = require('../controllers/course.controller')

const router = Router()

router.post('/', createCourseCheck(), create)

router.get('/', findAll)

router.patch('/:id', updateCourseCheck(), update)

router.delete('/:id', deleteCourseCheck(), deleteById)

module.exports = router
