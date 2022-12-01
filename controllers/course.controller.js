const { DateTime } = require('luxon')
const { request, response } = require('express')

const { Course } = require('../models')
const { serverErrorHandler } = require('../helpers')

const create = async (req = request, res = response) => {
  try {
    const { name, description, duration, maxCapacity, minRequired } = req.body

    const data = {
      createdAt: DateTime.now(),
      description: description.toLowerCase().trim(),
      duration,
      maxCapacity,
      minRequired,
      name: name.toLowerCase().trim(),
      user: req.authenticatedUser.id,
    }

    const course = new Course(data)
    await course.save()

    res.json({
      course,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const findAll = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1
    lot = lot <= 0 || isNaN(lot) ? 10 : lot

    const query = { status: true }

    const [courses, total] = await Promise.all([
      Course.find(query).populate('user').skip(from).limit(lot),
      Course.countDocuments(query),
    ])

    const quantity = courses.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      courses,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const update = async (req = request, res = response) => {
  try {
    const { name, description, duration, maxCapacity, minRequired } = req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (name) data.name = name.toLowerCase().trim()
    if (description) data.description = description.toLowerCase().trim()
    if (duration) data.duration = duration
    if (maxCapacity) data.maxCapacity = maxCapacity
    if (minRequired) data.minRequired = minRequired

    const course = await Course.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.json({
      course,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteById = async (req = request, res = response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
        updatedAt: DateTime.now(),
      },
      { new: true }
    )
    res.json({
      course,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  create,
  deleteById,
  findAll,
  update,
}
