const { request, response } = require('express')
const { DateTime } = require('luxon')

const { serverErrorHandler } = require('../helpers/server-error-handler')
const { Cohort } = require('../models')

const createCohort = async (req = request, res = response) => {
  try {
    const { code} = req.body

    const data = {
      careers: req.careersDB,
      code: code.toLowerCase().trim(),
      createdAt: DateTime.now(),
      user: req.authenticatedUser.id,
      participants: req.usersDB,
    }

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
    const { code, description, duration, quantity,} = req.body

    const data = {
      user: req.authenticatedUser.id,
      modifiedAt: DateTime.now(),
      careers: req.careersDB,
      participants: req.usersDB,
    }

    if(code) data.code = code
    if (description) data.description = description
    if (duration) data.duration = duration
    if (quantity) data.quantity = quantity

    const cohort = await Cohort.findByIdAndUpdate(req.params.id, data, { new: true })

    res.status(200).json({
      cohort,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteCohort = async (req = request, res = response) => {
  try {
    const cohort = await Cohort.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
        updatedAt: DateTime.now(),
      },
      { new: true }
    )
    res.status(200).json({
      cohort,
    })
  } catch (error) {
    handlerErrorServer(error)
  }
}

module.exports = { createCohort, getCohorts, updateCohort, deleteCohort }
