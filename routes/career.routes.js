const { Router } = require('express')
const { check } = require('express-validator')
const { userByIdExists } = require('../helpers/db-validators')

const { validateFields } = require('../middlewares')


const router = Router()

router.get('/', findAllCareers)

router.post(
    '/',
    [
        check('name', 'El nombre es requerido ').not().isEmpty(),
        check('descrption','La descripcion es requerida').not().isEmpty(),
        check('duration', 'La duracion es requerida').not().isEmpty(),
        check('maxCapacity', 'La cantidad maxima es requerida').not().isEmpty(),
        check('maxCapacity', 'La cantidad maxima debe de ser un numero').isNumeric(),
        check('minRequired', 'La cantidad minima requerida no puede ir vacia').not().isEmpty(),
        check('minRequired', 'La cantidad minima requerida debe de ser un numero'),
        check('user', `El ID no es válido`).isMongoId(),
        check('user').custom(userByIdExists),
        validateFields,
    ],
    createCareer
  )


  router.patch('/id', 
  updateCareer)


  router.delete('/id', deleteCareer)