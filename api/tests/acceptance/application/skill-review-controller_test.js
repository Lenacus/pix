const { expect, knex, generateValidRequestAuhorizationHeader } = require('../../test-helper');
const server = require('../../../server');

describe('Acceptance | API | SkillReviews', () => {

  describe('GET /api/skill-reviews/:id', () => {

    const nonPixMasterUserId = 9999;
    const inserted_assessment = {
      courseId: 1,
      userId: nonPixMasterUserId,
      type: 'SMART_PLACEMENT',
      state: 'completed'
    };

    let options;
    let assessmentId;

    beforeEach(() => {
      return knex('assessments').insert(inserted_assessment)
        .then(([createdAssessmentId]) => {
          assessmentId = createdAssessmentId;
          options = {
            method: 'GET',
            url: `/api/skill-reviews/${assessmentId}`,
            headers: {}
          };
        });
    });

    afterEach(() => {
      return knex('assessments').delete();
    });

    context('without authorization token', () => {
      beforeEach(() => {
        options.headers.authorization = 'invalid.access.token';
      });

      it('should return 401 HTTP status code', () => {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response) => {
          expect(response.statusCode).to.equal(401);
        });
      });
    });

    context('with authorization token', () => {
      beforeEach(() => {
        options.headers.authorization = generateValidRequestAuhorizationHeader(nonPixMasterUserId);
      });

      it('should return 200 HTTP status code', () => {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response) => {
          expect(response.statusCode).to.equal(200);
        });
      });
    });
  });
});