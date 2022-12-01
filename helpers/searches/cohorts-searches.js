const { Cohort, Career } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')

const searchCohorts = async (searchTerm = '', res = response) => {
  try {
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

    const regex = new RegExp(searchTerm, 'i')

    if (regex.test('true') || regex.test('false')) {
      const cohorts = await Cohort.find({
        status: regex.test('true'),
      })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['available'],
        quantity: cohorts.length,
        cohorts,
      })
    }

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

const searchCohortsByCareer = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ careers: { _id: searchTerm } })
        .populate('user')
        .populate('participants')
        .populate('careers')
      return res.status(200).json({
        queriedFields: ['career_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const careers = await Career.find({ name: regex })
    const careersIds = careers.map((career) => career.id)

    const cohorts = await Cohort.find({
      careers: {
        $in: careersIds,
      },
      status: true,
    })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['career_name'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchCohortsByParticipant = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ participants: { _id: searchTerm } })
        .populate('user')
        .populate('careers')
        .populate('participants')
      return res.status(200).json({
        queriedFields: ['user_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({ name: regex })
    const usersIds = users.map((user) => user.id)

    const cohort = await Cohort.find({
      participants: {
        $in: usersIds,
      },
      status: true,
    })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['user_name'],
      quantity: cohort.length,
      cohort,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchCohortsByUser = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ user: searchTerm })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['user_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({ name: regex })
    const usersIds = users.map((user) => user.id)

    const cohorts = await Cohort.find({
      user: {
        $in: usersIds,
      },
      status: true,
    })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['user_name'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  searchCohorts,
  searchCohortsByCareer,
  searchCohortsByParticipant,
  searchCohortsByUser,
}
