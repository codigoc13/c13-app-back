const { Router } = require('express')
const { check } = require('express-validator')

const { isRole, validateJWT } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')
const {
  createArticle,
  findAllArticles,
  updateArticle,
  deleteArticle,
} = require('../controllers/article.controller')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    validateFields,
  ],
  createArticle
)

router.get('/', findAllArticles)

// router.put(
//   '/:id',
//   [
//     validateJWT,
//     check('id', 'El Id no es valido').isMongoId(),
//     check('title', 'El título es requerido').not().isEmpty(),
//     check('description', 'La descripción es necesaria').not().isEmpty(),
//     validateFields,
//   ],
//   updateArticle
// )

// router.delete(
//   '/:id',
//   [
//     validateJWT,
//     isRole('ADMIN_ROLE'),
//     check('id', 'El id no es valido').isMongoId,
//     // check('id').custom(articleByIdExists),
//     validateFields,
//   ],
//   deleteArticle
// )

module.exports = router
