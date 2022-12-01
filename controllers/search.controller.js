const { request, response } = require('express')

const { serverErrorHandler } = require('../helpers')
const {
  searchArticles,
  searchArticlesByUser,
  searchCareers,
  searchCareersByUser,
  searchCohorts,
  searchCohortsByCareer,
  searchCohortsByParticipant,
  searchCohortsByUser,
  searchCourses,
  searchCoursesByUser,
  searchNovelties,
  searchNoveltiesByUser,
} = require('../helpers/searches')

const allowedCollections = [
  'articles',
  'articlesByUser',
  'careers',
  'careersByUser',
  'categories',
  'cohorts',
  'cohortsByCareer',
  'cohortsByParticipant',
  'cohortsByUser',
  'courses',
  'coursesByUser',
  'novelties',
  'noveltiesByUser',
]

const search = (req = request, res = response) => {
  try {
    const { collection, searchTerm } = req.params

    if (!allowedCollections.includes(collection)) {
      return res.status(400).json({
        msg: 'Colección de búsqueda no existe',
        allowedCollections,
      })
    }

    switch (collection) {
      case 'articles':
        searchArticles(searchTerm, res)
        break
      case 'articlesByUser':
        searchArticlesByUser(searchTerm, res)
        break
      case 'careers':
        searchCareers(searchTerm, res)
        break
      case 'careersByUser':
        searchCareersByUser(searchTerm, res)
        break
      case 'cohorts':
        searchCohorts(searchTerm, res)
        break
      case 'cohortsByCareer':
        searchCohortsByCareer(searchTerm, res)
        break
      case 'cohortsByParticipant':
        searchCohortsByParticipant(searchTerm, res)
        break
      case 'cohortsByUser':
        searchCohortsByUser(searchTerm, res)
        break
      case 'courses':
        searchCourses(searchTerm, res)
        break
      case 'coursesByUser':
        searchCoursesByUser(searchTerm, res)
        break
      case 'novelties':
        searchNovelties(searchTerm, res)
        break
      case 'noveltiesByUser':
        searchNoveltiesByUser(searchTerm, res)
        break
      default:
        res.status(500).json({
          msg: 'Búsqueda por hacer',
        })
    }
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  search,
}
