const { Cohort } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidCode = async (code = '') => {
  if (typeof code === 'string') {
    code = code.toLowerCase().trim()
    const cohort = await Cohort.findOne({ code })
    if (cohort) throw new Error(`Ya existe una cohorte con código '${code}'`)
  }
}

const cohortByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const cohortExists = await Cohort.findById(id)
    if (!cohortExists) {
      throw new Error(`La cohorte con id '${id}' no existe en la base de datos`)
    }
  }
}

module.exports = { isValidCode, cohortByIdExists }
