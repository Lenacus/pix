const { expect } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/profile-serializer');
const Profile = require('../../../../../lib/domain/models/Profile');
const BookshelfUser = require('../../../../../lib/infrastructure/data/user');
const Assessment = require('../../../../../lib/domain/models/Assessment');
const AssessmentResult = require('../../../../../lib/domain/models/AssessmentResult');
const Area = require('../../../../../lib/domain/models/Area');

describe('Unit | Serializer | JSONAPI | profile-serializer', () => {

  describe('#serialize', function() {

    let user;
    let areas;
    let competences;
    let finishedAssessment;
    let nonFinishedAssessment;
    let lastAssessments;
    let assessmentsCompletedWithResults;
    let courses;

    let emptyAssessments;
    let emptyCourses;

    beforeEach(() => {
      emptyAssessments = [];
      emptyCourses = [];

      user = new BookshelfUser({
        id: 'user_id',
        'firstName': 'Luke',
        'lastName': 'Skywalker',
        'email': 'luke@sky.fr',
      });

      areas = [
        new Area({
          id: 'recAreaA',
          name: 'area-name-1',
        }),
        new Area({
          id: 'recAreaB',
          name: 'area-name-2',
        }),
      ];

      competences = [
        {
          id: 'recCompA',
          name: 'competence-name-1',
          index: '1.1',
          description: 'description',
          areaId: 'recAreaA',
          courseId: 'courseID1',
          assessmentId: 'assessmentId1',
          level: -1,
          status: 'notAssessed',
          area: new Area({ id: 'recAreaA' }),
          isRetryable: false,
        },
        {
          id: 'recCompB',
          name: 'competence-name-2',
          index: '1.2',
          description: 'description',
          areaId: 'recAreaB',
          courseId: 'courseID2',
          assessmentId: 'assessmentId2',
          level: -1,
          status: 'notAssessed',
          area: new Area({ id: 'recAreaB' }),
          isRetryable: false,
        },
        {
          id: 'recCompC',
          name: 'competence-name-3',
          index: '1.3',
          description: 'description',
          areaId: 'recAreaB',
          courseId: 'courseID3',
          level: -1,
          status: 'notAssessed',
          area: new Area({ id: 'recAreaB' }),
          isRetryable: false,
        }];

      finishedAssessment = Assessment.fromAttributes({
        id: 'assessmentID1',
        courseId: 'courseID1',
        state: 'completed',
        type: Assessment.types.PLACEMENT,
        assessmentResults: [new AssessmentResult({
          level: 5,
          pixScore: 128,
          createdAt: new Date('2018-01-10T05:00:00Z'),
        })],
      });
      nonFinishedAssessment = Assessment.fromAttributes({
        id: 'assessmentID2',
        courseId: 'courseID2',
        state: 'started',
        type: Assessment.types.PLACEMENT,
      });

      lastAssessments = [finishedAssessment, nonFinishedAssessment];
      assessmentsCompletedWithResults = [finishedAssessment];

      courses = [{ id: 'courseID1', competences: ['recCompA'] },
        { id: 'courseID2', competences: ['recCompB'] },
        { id: 'courseID3', competences: ['recCompC'] },
      ];

    });

    it('should serialize a Profile into JSON:API data of type "users"', function() {
      // given
      const profile = new Profile({
        user,
        competences,
        areas,
        lastAssessments,
        assessmentsCompletedWithResults,
        courses,
      });
      const expectedJson = {
        data: {
          type: 'users',
          id: 'user_id',
          attributes: {
            'first-name': 'Luke',
            'last-name': 'Skywalker',
            'total-pix-score': 128,
            'email': 'luke@sky.fr',
          },
          relationships: {
            competences: {
              data: [
                { type: 'competences', id: 'recCompA' },
                { type: 'competences', id: 'recCompB' },
                { type: 'competences', id: 'recCompC' },
              ],
            },
            'campaign-participations': {
              links: {
                related: '/api/users/user_id/campaign-participations'
              },
            },
            'pix-score': {
              links: {
                related: '/api/users/user_id/pixscore'
              }
            },
            'scorecards': {
              links: {
                related: '/api/users/user_id/scorecards'
              }
            },
          },
        },
        included: [
          {
            type: 'areas',
            id: 'recAreaA',
            attributes: {
              name: 'area-name-1',
            },
          },
          {
            type: 'areas',
            id: 'recAreaB',
            attributes: {
              name: 'area-name-2',
            },
          },
          {
            type: 'competences',
            id: 'recCompA',
            attributes: {
              name: 'competence-name-1',
              index: '1.1',
              level: 5,
              description: 'description',
              'pix-score': 128,
              'course-id': 'courseID1',
              'assessment-id': 'assessmentID1',
              status: 'assessed',
              'is-retryable': true,
            },
            relationships: {
              area: {
                data: {
                  type: 'areas',
                  id: 'recAreaA',
                },
              },
            },
          },
          {
            type: 'competences',
            id: 'recCompB',
            attributes: {
              name: 'competence-name-2',
              index: '1.2',
              level: -1,
              description: 'description',
              status: 'assessmentNotCompleted',
              'course-id': 'courseID2',
              'assessment-id': 'assessmentID2',
              'is-retryable': false,
            },
            relationships: {
              area: {
                data: {
                  type: 'areas',
                  id: 'recAreaB',
                },
              },
            },
          },
          {
            type: 'competences',
            id: 'recCompC',
            attributes: {
              name: 'competence-name-3',
              index: '1.3',
              level: -1,
              description: 'description',
              status: 'notAssessed',
              'course-id': 'courseID3',
              'assessment-id': null,
              'is-retryable': false,
            },
            relationships: {
              area: {
                data: {
                  type: 'areas',
                  id: 'recAreaB',
                },
              },
            },
          },
        ],
      };

      // when
      const userSerialized = serializer.serialize(profile);

      // then
      expect(userSerialized).to.be.deep.equal(expectedJson);
    });

    it('should not serialize "total-pix-score" user attribute when no assessments', function() {
      // given
      const profile = new Profile({
        user,
        competences,
        areas,
        lastAssessments: emptyAssessments,
        assessmentsCompletedWithResults: emptyAssessments,
        courses: emptyCourses,
      });

      // when
      const userSerialized = serializer.serialize(profile);

      // then
      expect(userSerialized.data.attributes).not.to.have.property('total-pix-score');
    });
  });
});
