const { DateTime } = require('luxon')
const { request, response } = require('express')

const { Career } = require('../models')
const { serverErrorHandler } = require('../helpers/server-error-handler')

const createCareer = async (req = request, res = response) => {
  try {
    const { name, description, status, img, updatedAt, ...body } = req.body

    const data = {
      ...body,
      createdAt: DateTime.now(),
      description: description.toLowerCase().trim(),
      name: name.toLowerCase().trim(),
      user: req.authenticatedUser.id,
    }

    const career = new Career(data)
    await career.save()

    res.status(201).json({
      career,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const getCareers = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1
    lot = lot <= 0 || isNaN(lot) ? 10 : lot

    const query = { status: true }

    const [careers, total] = await Promise.all([
      Career.find(query)
        .populate('courses')
        .populate('user')
        .skip(from)
        .limit(lot),
      Career.countDocuments(query),
    ])

    const quantity = careers.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      careers,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const updateCareer = async (req = request, res = response) => {
  try {
    const { name, description, duration, maxCapacity, minRequired, courses } =
      req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (name) data.name = name.toLowerCase().trim()
    if (description) data.description = description.toLowerCase().trim()
    if (duration) data.duration = duration
    if (maxCapacity) data.maxCapacity = maxCapacity
    if (minRequired) data.minRequired = minRequired
    if (courses) data.courses = courses

    const career = await Career.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.status(200).json({
      career,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteCareer = async (req = request, res = response) => {
  try {
    const deletedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      { status: false, updatedAt: DateTime.now() },
      { new: true }
    )

    res.status(200).json({
      deletedCareer,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  createCareer,
  deleteCareer,
  getCareers,
  updateCareer,
}
