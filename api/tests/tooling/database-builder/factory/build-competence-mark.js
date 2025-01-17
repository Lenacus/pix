const faker = require('faker');
const buildAssessmentResult = require('./build-assessment-result');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

module.exports = function buildCompetenceMark({
  id,
  level = faker.random.number(),
  score = faker.random.number(),
  area_code = faker.random.number(),
  competence_code = `${faker.random.number()}_${faker.random.number()}`,
  assessmentResultId,
} = {}) {

  assessmentResultId = _.isNil(assessmentResultId) ? buildAssessmentResult().id : assessmentResultId;

  const values = {
    id, level, score, area_code, competence_code, assessmentResultId
  };
  return databaseBuffer.pushInsertable({
    tableName: 'competence-marks',
    values,
  });
};
