const articlesSearches = require('./articles-searches')
const careersSearches = require('./careers-searches')
const cohortsSearches = require('./cohorts-searches')
const coursesSearches = require('./courses-searches')
const noveltiesSearches = require('./novelties-searches')
const usersSearches = require('./users-searches')

module.exports = {
  ...articlesSearches,
  ...careersSearches,
  ...cohortsSearches,
  ...coursesSearches,
  ...noveltiesSearches,
  ...usersSearches,
}
