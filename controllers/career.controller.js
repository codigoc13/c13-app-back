const { request, response } = require('express')
const { DateTime } = require('luxon')
const { Career } = require('../models')

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
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

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
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
    }

    const career = new Career(data)
    const { _id } = await career.save()
    const newCareer = await Career.findOne({ _id })

    res.status(201).json({
      newCareer,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}
// const updateCareer = async (req = request, res = response) => {
//   try {
//     const { id } = req.params
//     let { status, createdAt, ...body } = req.body
//     const name = req.body.name.toLowerCase().trim()

//     const careerDB = await Career.findOne({ name })
//     if (careerDB) {
//       return res.status(400).json({
//         msg: `La carrera ${careerDB.name} ya existe`,
//       })
//     }

//     const data = {
//       ...body,
//       name,
//       user: req.authenticatedUser.id,
//       modifiedAt: DateTime.now(),
//     }

//     const career = await Career.findByIdAndUpdate(id, data, { new: true })

//     res.status(200).json({
//       career,
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error en el servidor',
//     })
//   }
// }

const updateCareer = async (req = request, res = response) => {
  try {
    let { name, description } = req.body

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
    const career = await Career.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.status(200).json({
      career,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

// const handlerErrorServer = (error) => {
//   console.log(error)
//   res.status(500).json({
//     msg: 'Error en el Servidor',
//   })
// }

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
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  getCareers,
  createCareer,
  deleteCareer,
  updateCareer,
}
