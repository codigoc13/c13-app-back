const { DateTime } = require('luxon')
const { request, response } = require('express')

const { Cohort, User, Career } = require('../models')
const { serverErrorHandler } = require('../helpers/server-error-handler')
const { isObjectId } = require('../helpers')

const createCohort = async (req = request, res = response) => {
  try {
    const { description, status, careers, participants, ...body } = req.body

    const data = {
      ...body,
      createdAt: DateTime.now(),
      user: req.authenticatedUser.id,
    }

    if (careers) data.careers = [...new Set(careers)]
    if (description) data.description = description.toLowerCase().trim()
    if (participants) data.participants = [...new Set(participants)]

    const cohort = new Cohort(data)
    await cohort.save()

    res.status(201).json({
      cohort,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const getCohorts = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1
    lot = lot <= 0 || isNaN(lot) ? 10 : lot

    const query = { status: true }

    const [cohorts, total] = await Promise.all([
      Cohort.find(query)
        .populate('user')
        .populate('careers')
        .populate('participants')
        .skip(from)
        .limit(lot),
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
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const updateCohort = async (req = request, res = response) => {
  try {
    const {
      careers,
      code,
      createdAt,
      description,
      duration,
      img,
      participants,
      quantity,
      ...body
    } = req.body

    const data = {
      code,
      user: req.authenticatedUser.id,
      updatedAt: DateTime.now(),
    }

    if (careers) data.careers = [...new Set(careers)]
    if (code) data.code = code
    if (description) data.description = description.toLowerCase().trim()
    if (duration) data.duration = duration
    if (participants) data.participants = [...new Set(participants)]
    if (quantity) data.quantity = quantity

    const cohort = await Cohort.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.status(200).json({
      cohort,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteCohort = async (req = request, res = response) => {
  try {
    const deletedCohort = await Cohort.findByIdAndUpdate(
      req.params.id,
      { status: false, updatedAt: DateTime.now() },
      { new: true }
    )
    res.status(200).json({
      deletedCohort,
    })
  } catch (error) {
    handlerErrorServer(error)
  }
}

const search = async (req = request, res = response) => {
  try {
    const { term: searchTerm } = req.params

    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.findById(searchTerm)
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['id'],
        results: cohort ? [cohort] : [],
      })
    }

    //2022-10-23T12:50:30.210Z
    const date = DateTime.fromFormat(searchTerm, 'yyyy-MM-dd').toUTC()

    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const cohorts = await Cohort.find({
        $or: [
          {
            $expr: {
              $and: [{ $eq: [{ $year: UTCCreatedAt }, { $year: date }] }],
              $and: [{ $eq: [{ $month: UTCCreatedAt }, { $month: date }] }],
              $and: [
                { $eq: [{ $dayOfMonth: UTCCreatedAt }, { $dayOfMonth: date }] },
              ],
            },
          },
          {
            $expr: {
              $and: [{ $eq: [{ $year: UTCUpdatedAt }, { $year: date }] }],
              $and: [{ $eq: [{ $month: UTCUpdatedAt }, { $month: date }] }],
              $and: [
                { $eq: [{ $dayOfMonth: UTCUpdatedAt }, { $dayOfMonth: date }] },
              ],
            },
          },
        ],
        $and: [{ status: true }],
      })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['createdAt', 'updatedAt'],
        quantity: cohorts.length,
        cohorts,
      })
    }

    if (searchTerm === 'true' || searchTerm === 'false') {
      const cohorts = await Cohort.find({
        status: searchTerm === 'true',
      })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['status'],
        quantity: cohorts.length,
        cohorts,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const cohorts = await Cohort.find({ code: regex, status: true })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['code'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const searchByEntities = async (req = request, res = response) => {
  try {
    const { term: searchTerm } = req.params

    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({
        $or: [
          { user: searchTerm, status: true },
          { careers: { _id: searchTerm }, status: true },
          { participants: { _id: searchTerm }, status: true },
        ],
      })
        .populate('user')
        .populate('careers')
        .populate('participants')
      return res.status(200).json({
        queriedFields: ['user.id', 'participants.*.id', 'careers.*.id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
    })
    const usersIds = users.map((user) => user.id)

    const careers = await Career.find({ name: regex })
    const careersIds = careers.map((career) => career.id)

    const cohorts = await Cohort.find({
      $or: [
        { user: { $in: usersIds }, status: true },
        { careers: { $in: careersIds }, status: true },
        { participants: { $in: usersIds }, status: true },
      ],
    })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: [
        'user.firstName',
        'user.lastName',
        'user.username',
        'participants.firstName',
        'participants.lastName',
        'participants.username',
        'careers.name',
      ],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  createCohort,
  deleteCohort,
  getCohorts,
  search,
  searchByEntities,
  updateCohort,
}
