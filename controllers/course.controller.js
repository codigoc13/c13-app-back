const { request, response } = require('express')
const { DateTime } = require('luxon')
const { Course } = require('../models')
const { serverErrorHandler } = require('../helpers')

const create = async (req = request, res = response) => {
  try {
    let { name, description, duration, maxCapacity, minRequired } = req.body
    name = name.toLowerCase().trim()

    const courseDB = await Course.findOne({ name })
    if (courseDB) {
      return res.status(400).json({
        msg: `Ya existe el curso: ${name}`,
      })
    }

    const data = {
      name,
      description,
      duration,
      maxCapacity,
      minRequired,
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
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
    let { name, description, duration, maxCapacity, minRequired } = req.body

    const data = {
      updateAt: DateTime.now(),
    }

    if (name) {
      name = name.toLowerCase().trim()

      const courseDB = await Course.findOne({ name })
      if (courseDB) {
        return res.status(400).json({
          msg: `Ya existe el curso: ${name}`,
        })
      }
      data.name = name
    }

    if (description) data.description = description
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
  findAll,
  update,
  deleteById,
}
