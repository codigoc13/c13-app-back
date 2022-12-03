const { DateTime } = require('luxon')

const { Course, User } = require('../../models')
const { isObjectId } = require('../validate-object-id')
const { serverErrorHandler } = require('../server-error-handler')

const searchCourses = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const course = await Course.findById(searchTerm).populate('user')

      return res.status(200).json({
        queriedFields: ['id'],
        results: course ? [course] : [],
      })
    }

    //2022-10-23
    const date = DateTime.fromFormat(searchTerm, 'yyyy-MM-dd').toUTC()
    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const courses = await Course.find({
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
      }).populate('user')

      return res.status(200).json({
        queriedFields: ['createdAt', 'updatedAt'],
        quantity: courses.length,
        courses,
      })
    }

    if (searchTerm === 'true' || searchTerm === 'false') {
      const courses = await Course.find({
        status: searchTerm === 'true',
      }).populate('user')

      return res.status(200).json({
        queriedFields: [`status: ${searchTerm}`],
        quantity: courses.length,
        courses,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const courses = await Course.find({
      name: regex,
      status: true,
    }).populate('user')

    res.status(200).json({
      queriedFields: ['name'],
      quantity: courses.length,
      courses,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const searchCoursesByUser = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const course = await Course.find({ user: searchTerm }).populate('user')
      return res.status(200).json({
        queriedFields: ['user.id'],
        results: course ? [course] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
    })
    const usersIds = users.map((user) => user.id)

    const courses = await Course.find({
      user: {
        $in: usersIds,
      },
      status: true,
    }).populate('user')

    res.status(200).json({
      queriedFields: ['user.firstName', 'user.lastName', 'user.username'],
      quantity: courses.length,
      courses,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  searchCourses,
  searchCoursesByUser,
}
