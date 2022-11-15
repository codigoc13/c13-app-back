const { request, response } = require('express')
const { DateTime } = require('luxon')
const { Career } = require('../models') 


const getCareers = async ( req = request, res = response) =>{
    try {
        let { from = 0, lot = 10} = req.query
        from = from <= 0 ||isNaN(from) ? 0 : from -1


        const query = { status: true}

        const [careers,total] = await Promise.all([
            Career.find(query).populate('courses').populate('user').skip(from).limit(lot),
            Career.countDocuments(query)
        ])

        const quantity = careers.length
        const pagination = {
            from: Number(from + 1),
            lot: Number(lot)
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

const createCareer = async (req = request, res = response) =>{
    try {
      let { name , status, ...body} = req.body

      name = req.body.name.trim().toUpperCase()
      const careerDB = await Career.findOne({ name })
  
      if (careerDB) {
        return res.status(400).json({
          msg: `La categoría ${careerDB.name} ya existe`,
        })
      }

      const data = {
        ...body,
        name,
        user: req.authenticatedUser.id,
        createdAt: DateTime.now()
      }

      const career = new Career(data)
      const {_id} = await career.save()
      const newCareer = await Career.findOne({_id})
      
      
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
  
  module.exports = {
      getCareers,
      createCareer,
    }