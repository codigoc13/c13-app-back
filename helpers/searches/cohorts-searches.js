const { Cohort, Career } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')
const { isObjectId } = require('../validate-object-id')

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
  searchCohortsByCareer,
  searchCohortsByParticipant,
  searchCohortsByUser,
}
