const { request, response } = require('express')
const { DateTime } = require('luxon')
const { serverErrorHandler } = require('../helpers')
const { Course } = require('../models')

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

module.exports = {
  create,
  findAll,
}
