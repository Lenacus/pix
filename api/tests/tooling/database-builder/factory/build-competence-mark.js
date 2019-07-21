const faker = require('faker');
const buildAssessmentResult = require('./build-assessment-result');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

module.exports = function buildCompetenceMark({
  id,
  level = faker.random.number(),
  score = faker.random.number(),
  area_code = faker.random.number().toString(),
  competence_code = `${faker.random.number()}_${faker.random.number()}`,
  assessmentResultId = undefined,
  createdAt = faker.date.past(),
} = {}) {

  assessmentResultId = _.isUndefined(assessmentResultId) ? buildAssessmentResult().id : assessmentResultId;

  const values = {
    id,
    level,
    score,
    area_code,
    competence_code,
    assessmentResultId,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'competence-marks',
    values,
  });
};
