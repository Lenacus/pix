/* eslint-disable no-console, no-unused-vars */
require('dotenv').config();
const _ = require('lodash');

const { knex } = require('../../db/knex-database-connection');

const createAssessmentResultForCompletedAssessment = require('../../lib/domain/usecases/create-assessment-result-for-completed-assessment');

async function _removeCompetenceMarksByAssessmentResultId(assessmentResultId) {
  await knex('competence-marks').where({ assessmentResultId }).delete();
}

async function recomputeCertificationCoursesV2({
  // Repositories
  answerRepository,
  assessmentRepository,
  assessmentResultRepository,
  certificationCourseRepository,
  challengeRepository,
  competenceRepository,
  competenceMarkRepository,
  courseRepository,
  skillRepository,
  // Services
  scoringService
}) {
  const queryResults = await _getAssessmentIdsAndResultsIdsToRecompute();
  for (const [assessmentId, assessmentResultId] of queryResults) {
    try {
      await _removeCompetenceMarksByAssessmentResultId(assessmentResultId);
      await createAssessmentResultForCompletedAssessment({
        ...arguments[0],
        ...{ assessmentId, assessmentResultId, forceRecomputeResult: true, updateCertificationCompletionDate: false }
      });
    } catch (err) {
      console.log(`Unable to recompute assessment result for assessmentId : ${assessmentId}`);
      console.error(err);
    }
  }
}

async function _getAssessmentIdsAndResultsIdsToRecompute() {
  try {
    const queryResults = await knex
      .select('assessments.id as assessmentId', 'assessment-results.id as assessmentResultId')
      .from('assessments')
      .join('certification-courses', 'assessments.courseId', '=', knex.raw('cast("certification-courses".id as varchar)'))
      .leftOuterJoin('assessment-results', 'assessments.id', '=', 'assessment-results.assessmentId')
      .where('certification-courses.isV2Certification', true);

    return _.map(queryResults, (queryResult) => {
      return [queryResult.assessmentId, queryResult.assessmentResultId];
    });

  } catch (err) {
    console.log('Unable to compute assessment ids');
    console.log(err);
  }
}

module.exports = recomputeCertificationCoursesV2;
