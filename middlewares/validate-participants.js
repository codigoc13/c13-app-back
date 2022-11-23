const { response, request } = require('express')

const { isObjectId } = require('../helpers/validate-object-id')
const { User } = require('../models')
const { serverErrorHandler } = require('../helpers/server-error-handler')

const validateParticipants = async (req = request, res = response, next) => {

    try {
        const { participants: usersIds } = req.body

        if (usersIds) {
            const invalidIds = usersIds.filter((userId) => {
                if (!isObjectId(userId)) {
                    return userId
                }
            })

            if (invalidIds.length > 0) {
                return res.status(400).json({
                    msg: 'Debe ser id de mongo válidos',
                    invalidIds,
                })
            }

            const usersDB = await User.find({ _id: { $in: usersIds } })
            const usersIdsDB = usersDB.map((userDB) => userDB._id.valueOf())
            const usersIdsNotFound = usersIds.filter((userId) => {
                if (!usersIdsDB.includes(userId)) {
                    return userId
                }
            })

            if (usersIdsNotFound.length > 0) {
                return res.status(400).json({
                    msg: 'Los siguiente usuarios no existen en la BD',
                    usersIdsNotFound,
                })
            }

            const usersWrongRole = usersDB.filter((userDB) => {
                return userDB.role !== 'STUDENT_ROLE'
            })

            if (usersWrongRole.length > 0) {
                return res.status(400).json({
                    msg: 'Los siguiente usuarios no tiene rol de estudiante',
                    usersWrongRole,
                })
            }

            req.usersDB = usersDB
        }
        next()
    } catch (error) {
        serverErrorHandler(error, res)
    }
}

module.exports = {
    validateParticipants
}