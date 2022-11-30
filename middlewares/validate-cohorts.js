const { check, body } = require('express-validator')

const { validateCareers} = require('./validate-careers')
const { validateFields } = require('./validate-fields')
const { validateParticipants} = require('./validate-participants')
const { validateJWT } = require('./validate-jwt')
const { isRole } = require('./validate-roles')
const { isValidCode, cohortByIdExists, message} = require('../helpers')

const createCohortCheck = () => {
    return [
        validateJWT,

        isRole('admin'),

        check('code')
            .notEmpty()
            .withMessage('El código es requerido')
            .if(body('code').exists())
            .isString()
            .withMessage('El código debe ser una cadena de caracteres')
            .custom(isValidCode),

        check('duration')
            .notEmpty()
            .withMessage('La duración es requerida')
            .if(body('duration').exists())
            .isNumeric()
            .withMessage('La duración debe ser una cadena de numeros'),
        
        check('quantity')
            .notEmpty()
            .withMessage('La cantidad es requerida')
            .if(body('quantity').exists())
            .isNumeric()
            .withMessage('La cantidad debe ser una cadena de numeros'),
        validateCareers,
        validateParticipants,
        validateFields,
    ]
}

const updateCohortCheck = () => {
    return [
        validateJWT,

        isRole('admin'),

        check('id')
            .isMongoId()
            .withMessage(message.idIsNotValid)
            .custom(cohortByIdExists),

        check('code')
            .if(body('code').exists())
            .isString()
            .withMessage('El código debe ser una cadena de caracteres')
            .custom(isValidCode),

        check('duration')
            .if(body('duration').exists())
            .isNumeric()
            .withMessage('La duración debe ser una cadena de numeros'),

        check('quantity')
            .if(body('quantity').exists())
            .isNumeric()
            .withMessage('La cantidad debe ser una cadena de numeros'),    

        validateCareers,
        validateParticipants,
        validateFields,
    ]
}

const deleteCohortCheck = () => {
    return [
        validateJWT,

        isRole('admin'),

        check('id')
            .isMongoId()
            .withMessage(message.idIsNotValid)
            .custom(cohortByIdExists),
        validateFields,
    ]
}

module.exports = {
    createCohortCheck, updateCohortCheck, deleteCohortCheck
}