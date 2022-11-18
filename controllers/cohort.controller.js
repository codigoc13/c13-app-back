const { request, response } = require('express')
const { isObjectId } = require('../helpers/validate-object-id')
const { DateTime } = require('luxon')
const { Cohort, User, Career } = require('../models')

const createCohort = async (req = request, res = response) => {
  try {
    let { code, ...body } = req.body
    const { careers: careersIds, users: usersIds } = req.body

    code = code.toUpperCase().trim()
    const codeBD = await Cohort.findOne({ code })
    if (codeBD) {
      return res.status(400).json({
        msg: `La cohorte con el código ${codeBD.code} ya existe`,
      })
    }

    const data = {
      ...body,
      code,
      careers: [],
      users: [],
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
    }

    if (!isObjectId(careersIds)) {
      return res.status(400).json({
        msg: 'La carrera debe ser un id Mongo',
      })
    }

    const careers = await Career.findById(careersIds)
    if (!careers) {
      return res.status(400).json({
        msg: `No existe una carrera con id ${careersIds} en la BD`,
      })
    }
    data.careers = careers._id

    const invalidIds = usersIds.filter((usersId) => {
      if (!isObjectId(usersId)) {
        return usersId
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
      if (!careersIdsDB.includes(productId)) {
        return careerId
      }
    })

    if (careersIdsNotFound.length > 0) {
      return res.status(400).json({
        msg: 'Los siguiente carrera no existen en la BD',
        careersIdsNotFound,
      })
    }

    if (careersDB.length === 0) {
      return res.status(400).json({
        msg: 'Debe haber como mínimo un carrera para realizar la factura',
      })
    }
    data.careers = careersDB

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

    const cohort = new Cohort(data)
    await cohort.save()

    data.users = usersDB

    res.status(201).json({
      cohort,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const getCohorts = async (req = request, res = response) => {
  let { from = 0, lot = 10 } = req.query
  from = from <= 0 || isNaN(from) ? 0 : from - 1
  lot = lot <= 0 || isNaN(lot) ? 10 : lot

  const query = { status: true }

  const [cohorts, total] = await Promise.all([
    Cohort.find(query).populate('user').skip(from).limit(lot),
    Cohort.countDocuments(query),
  ])

  const quantity = cohorts.length
  const pagination = {
    from: Number(from + 1),
    lot: Number(lot),
  }

  res.status(200).json({
    total,
    quantity,
    pagination,
    cohorts,
  })
}

module.exports = { createCohort, getCohorts }
