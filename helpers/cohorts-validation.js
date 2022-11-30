const { Cohort } = require('../models')

const isValidCode = async (code = '') => {
    if (typeof code === 'string') {
        code = code.toLowerCase()
        const cohort = await Cohort.findOne({ code })
        if (cohort) throw new Error(`Ya existe una cohorte con código '${code}'`)
    }
}


module.exports = { isValidCode }