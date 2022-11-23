const { response, request } = require('express')

const { serverErrorHandler } = require('../helpers/server-error-handler')
const { isObjectId } = require('../helpers/validate-object-id')
const { Career } = require('../models')

const validateCareers = async (req = request, res = response, next) => {
    try {
        const { careers: careersIds } = req.body

        if (careersIds) {
            const invalidIds = careersIds.filter((careerId) => {
                if (!isObjectId(careerId)) {
                    return careerId
                }
            })

            if (invalidIds.length > 0) {
                return res.status(400).json({
                    msg: 'Debe ser id de mongo válidos',
                    invalidIds,
                })
            }

            const careersDB = await Career.find({ _id: { $in: careersIds } })
            const careersIdsDB = careersDB.map((careerDB) => careerDB._id.valueOf())
            const careersIdsNotFound = careersIds.filter((careerId) => {
                if (!careersIdsDB.includes(careerId)) {
                    return careerId
                }
            })

            if (careersIdsNotFound.length > 0) {
                return res.status(400).json({
                    msg: 'Las siguiente carreras no existen en la BD',
                    careersIdsNotFound,
                })
            }
            req.careersDB = careersDB
        }
        next()
    } catch (error) {
        serverErrorHandler(error, res)
    }
}

module.exports = {
    validateCareers,
}
