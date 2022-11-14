const {request, response} = require('express')
const {DateTime} = require('luxon')
const {Cohort} = require('../models')

const getCohorts = async (req = request, res = response) => {
  let {from = 0, lot = 10} = req.query
  from = from <= 0 || isNaN(from) ? 0 : from - 1

  const query = {status: true}

  const [cohorts, total] = await Promise.all([
    Cohort.find(query).populate('user').skip(from).limit(lot),
    Cohort.countDocuments(query),
  ])

  const quantity = cohorts.length
  const pagination = {
    from: Number(from + 1),
    lot: Number(lot),
  }
  // const cohorts = await Cohort.find({status: true})

  res.status(200).json({
    total,
    quantity,
    pagination,
    cohorts: cohorts.length,
    cohorts,
  })
}

const createCohort = async (req = request, res = response) => {
  try {
    let {code, status, ...body} = req.body

    const codeBD = await Cohort.findOne({code})
    if (codeBD) {
      return res.status(400).json({
        msg: `La cohorte con el código ${codeBD.code} ya existe`,
      })
    }

    const data = {
      code,
      ...body,
      //   user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
    }
    const cohort = new Cohort(data)
    const {_id} = await cohort.save()
    const newCohort = await Cohort.findById({_id})

    res.status(201).json({
      newCohort,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {createCohort, getCohorts}
