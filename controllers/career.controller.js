const { request, response } = require('express')
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

  
  module.exports = {
    getCareers,
  }