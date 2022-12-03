const { DateTime } = require('luxon')
const { Career, User, Course } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')
const { isObjectId } = require('../validate-object-id')

const searchCareers = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const career = await Career.findById(searchTerm)
        .populate('courses')
        .populate('user')

      return res.status(200).json({
        queriedFields: ['id'],
        results: career ? [career] : [],
      })
    }

    //2022-10-23
    const date = DateTime.fromFormat(searchTerm, 'yyyy-MM-dd').toUTC()

    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const careers = await Career.find({
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
        quantity: careers.length,
        careers,
      })
    }

    if (searchTerm === 'true' || searchTerm === 'false') {
      const careers = await Career.find({
        status: searchTerm === 'true',
      }).populate('user')

      return res.status(200).json({
        queriedFields: [`status: ${searchTerm}`],
        quantity: careers.length,
        careers,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const careers = await Career.find({ name: regex, status: true }).populate(
      'user'
    )

    res.status(200).json({
      queriedFields: ['name'],
      quantity: careers.length,
      careers,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const searchCareersByEntities = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const career = await Career.find({
        $or: [{ user: searchTerm }, { courses: { _id: searchTerm } }],
        $and: { status: true },
      })
        .populate('user')
        .populate('courses')
      return res.status(200).json({
        queriedFields: ['user.id', 'courses.*.id'],
        results: career ? [career] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
    })
    const usersIds = users.map((user) => user.id)

    const courses = await Course.find({ name: regex })
    const coursesIds = courses.map((course) => course.id)

    const careers = await Career.find({
      $or: [
        { user: { $in: usersIds }, status: true },
        { courses: { $in: coursesIds }, status: true },
      ],
    })
      .populate('user')
      .populate('courses')

    res.status(200).json({
      queriedFields: [
        'user.firstName',
        'user.lastName',
        'user.username',
        'course.name',
      ],
      quantity: careers.length,
      careers,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = { searchCareers, searchCareersByEntities }
