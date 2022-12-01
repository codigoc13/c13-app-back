const { Router } = require('express')

const {
  create,
  deleteById,
  findAll,
  update,
} = require('../controllers/course.controller.js')
const {
  createCourseCheck,
  deleteCourseCheck,
  updateCourseCheck,
} = require('../middlewares')

const router = Router()

router.post('/', createCourseCheck(), create)

router.get('/', findAll)

router.patch('/:id', updateCourseCheck(), update)

router.delete('/:id', deleteCourseCheck(), deleteById)

module.exports = router
