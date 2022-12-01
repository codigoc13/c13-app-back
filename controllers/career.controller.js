const { request, response } = require('express')
const { DateTime } = require('luxon')

const { serverErrorHandler } = require('../helpers/server-error-handler')
const { Career } = require('../models')

const createCareer = async (req = request, res = response) => {
  try {
    let { name, status, ...body } = req.body

    name = req.body.name.toLowerCase().trim()
    description = req.body.description.toLowerCase().trim()
    const careerDB = await Career.findOne({ name })

    if (careerDB) {
      return res.status(400).json({
        msg: `La carrera ${careerDB.name} ya existe`,
      })
    }

    const data = {
      ...body,
      name,
      courses: req.coursesDB,
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
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
    let { name, description, duration, maxCapacity, minRequired } = req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (name) {
      name = name.toLowerCase().trim()

      const careerDB = await Career.findOne({ name })
      if (careerDB) {
        return res.status(400).json({
          msg: `La carrera ${careerDB.name} ya existe`,
        })
      }
      data.name = name
    }

    if (description) data.description = description.toLowerCase().trim()
    if (duration) data.duration = duration
    if (maxCapacity) data.maxCapacity = maxCapacity
    if (minRequired) data.minRequired = minRequired
    if (req.coursesDB) data.courses = req.coursesDB

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
    const { id } = req.params
    const query = { status: false, updatedAt: DateTime.now() }

    const deleteCareer = await Career.findByIdAndUpdate(id, query, {
      new: true,
    })

    res.status(200).json({
      deleteCareer,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  getCareers,
  createCareer,
  deleteCareer,
  updateCareer,
}
