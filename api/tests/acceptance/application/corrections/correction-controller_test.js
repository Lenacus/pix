const { expect, knex, nock } = require('../../../test-helper');
const server = require('../../../../server');
const cache = require('../../../../lib/infrastructure/cache');

describe('Acceptance | Controller | correction-controller', () => {

  describe('GET /api/corrections', function() {

    let insertedAssessmentId = null;
    let insertedAnswerId = null;

    before(() => {
      return knex.migrate.latest()
        .then(() => {
          nock('https://api.airtable.com')
            .get('/v0/test-base/Epreuves/q_first_challenge')
            .query(true)
            .times(2)
            .reply(200, {
              'id': 'q_first_challenge',
              'fields': {
                'Statut': 'validé',
                'competences': ['competence_id'],
                'acquis': ['@web3'],
                'Bonnes réponses': 'fromage',
                'Acquix': ['q_first_acquis']
              }
            });
          nock('https://api.airtable.com')
            .get('/v0/test-base/Acquis/q_first_acquis')
            .query(true)
            .times(2)
            .reply(200, {
              'id': 'q_first_acquis',
              'fields': {
                'Nom': '@web3',
                'Indice': 'Indice web3',
                'Statut de l\'indice': 'Validé'
              }
            });
        });
    });

    after(() => {
      nock.cleanAll();
      cache.flushAll();
    });

    beforeEach(() => {
      const completedAssessment = {
        courseId: 'adaptive_course_id',
        state: 'completed'
      };
      return knex('assessments')
        .insert([completedAssessment])
        .then((rows) => {
          insertedAssessmentId = rows[0];

          const inserted_answer = {
            value: 'any good answer',
            result: 'ok',
            challengeId: 'q_first_challenge',
            assessmentId: insertedAssessmentId
          };

          return knex('answers').insert([inserted_answer]);
        }).then((rows) => {
          insertedAnswerId = rows[0];
        });
    });

    afterEach(() => {
      return knex('assessments').delete();
    });

    it('should not necessitate auth and return 200 HTTP status with an array of one solution', () => {
      // given
      const options = {
        method: 'GET',
        url: `/api/corrections?answerId=${insertedAnswerId}`
      };
      const expectedBody = {
        'data': [{
          'attributes': {
            'solution': 'fromage',
            'hint': 'Indice web3'
          },
          'id': 'q_first_challenge',
          'type': 'corrections'
        }]
      };

      // when
      const promise = server.inject(options);

      // then
      return promise.then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedBody);
      });
    });
  });
});