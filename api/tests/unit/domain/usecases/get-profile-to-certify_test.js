const { expect, sinon } = require('../../../test-helper');
const getProfileToCertify = require('../../../../lib/domain/usecases/get-profile-to-certify');
const BookshelfAnswer = require('../../../../lib/infrastructure/data/answer');
const Bookshelf = require('../../../../lib/infrastructure/bookshelf');
const Assessment = require('../../../../lib/domain/models/Assessment');
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
const Skill = require('../../../../lib/domain/models/Skill');
const Challenge = require('../../../../lib/domain/models/Challenge');
const Competence = require('../../../../lib/domain/models/Competence');

describe('Unit | Domain | Use Cases | getProfileToCertify', () => {

  const assessmentRepository= { findLastCompletedAssessmentsForEachCoursesByUser:sinon.stub().resolves() };
  const challengeRepository= { list:sinon.stub().resolves() };
  const answerRepository= { findCorrectAnswersByAssessment:sinon.stub().resolves() };
  const competenceRepository= { list:sinon.stub().resolves() };
  const courseRepository= { getAdaptiveCourses:sinon.stub().resolves() };

  let sandbox;
  const userId = 63731;

  const AnswerCollection = Bookshelf.Collection.extend({
    model: BookshelfAnswer
  });
  const answerCollectionWithEmptyData = AnswerCollection.forge([]);

  function _createCompetence(id, index, name) {
    const competence = new Competence();
    competence.id = id;
    competence.index = index;
    competence.name = name;

    return competence;
  }

  function _createChallenge(id, competence, skills, testedSkill, status = 'validé') {
    const challenge = Challenge.fromAttributes();
    challenge.id = id;
    challenge.skills = skills;
    challenge.competenceId = competence;
    challenge.testedSkill = testedSkill;
    challenge.status = status;
    return challenge;
  }

  const skillCitation4 = new Skill({ name: '@citation4' });
  const skillCollaborer4 = new Skill({ name: '@collaborer4' });
  const skillMoteur3 = new Skill({ name: '@moteur3' });
  const skillRecherche4 = new Skill({ name: '@recherche4' });
  const skillRemplir2 = new Skill({ name: '@remplir2' });
  const skillRemplir4 = new Skill({ name: '@remplir4' });
  const skillUrl3 = new Skill({ name: '@url3' });
  const skillWeb1 = new Skill({ name: '@web1' });
  const skillWithoutChallenge = new Skill({ name: '@oldSKill8' });

  const competenceFlipper = _createCompetence('competenceRecordIdOne', '1.1', '1.1 Construire un flipper');
  const competenceDauphin = _createCompetence('competenceRecordIdTwo', '1.2', '1.2 Adopter un dauphin');

  const challengeForSkillCitation4 = _createChallenge('challengeRecordIdOne', competenceFlipper.id, [skillCitation4], '@citation4');
  const challengeForSkillCitation4AndMoteur3 = _createChallenge('challengeRecordIdTwo', competenceFlipper.id, [skillCitation4, skillMoteur3], '@citation4');
  const challengeForSkillCollaborer4 = _createChallenge('challengeRecordIdThree', 'competenceRecordIdThatDoesNotExistAnymore', [skillCollaborer4], '@collaborer4');
  const challengeForSkillRecherche4 = _createChallenge('challengeRecordIdFour', competenceFlipper.id, [skillRecherche4], '@recherche4');
  const challengeForSkillRemplir2 = _createChallenge('challengeRecordIdFive', competenceDauphin.id, [skillRemplir2], '@remplir2');
  const challengeForSkillRemplir4 = _createChallenge('challengeRecordIdSix', competenceDauphin.id, [skillRemplir4], '@remplir4');
  const challengeForSkillUrl3 = _createChallenge('challengeRecordIdSeven', competenceDauphin.id, [skillUrl3], '@url3');
  const challengeForSkillWeb1 = _createChallenge('challengeRecordIdEight', competenceDauphin.id, [skillWeb1], '@web1');
  const challengeRecordWithoutSkills = _createChallenge('challengeRecordIdNine', competenceFlipper.id, [], null);
  const archivedChallengeForSkillCitation4 = _createChallenge('challengeRecordIdTen', competenceFlipper.id, [skillCitation4], '@citation4', 'archive');
  const oldChallengeWithAlreadyValidatedSkill = _createChallenge('challengeRecordIdEleven', competenceFlipper.id, [skillWithoutChallenge], '@oldSkill8', 'proposé');

  const assessmentResult1 = new AssessmentResult({ level: 1, pixScore: 12 });
  const assessmentResult2 = new AssessmentResult({ level: 2, pixScore: 23 });
  const assessmentResult3 = new AssessmentResult({ level: 0, pixScore: 2 });
  const assessment1 = Assessment.fromAttributes({ id: 13, status: 'completed', courseId: 'courseId1', assessmentResults: [assessmentResult1] });
  const assessment2 = Assessment.fromAttributes({ id: 1637, status: 'completed', courseId: 'courseId2', assessmentResults: [assessmentResult2] });
  const assessment3 = Assessment.fromAttributes({ id: 145, status: 'completed', courseId: 'courseId3', assessmentResults: [assessmentResult3] });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    courseRepository.getAdaptiveCourses.resolves([
      { competences: ['competenceRecordIdOne'], id: 'courseId1' },
      { competences: ['competenceRecordIdTwo'], id: 'courseId2' },
    ]);
    assessmentRepository.findLastCompletedAssessmentsForEachCoursesByUser.resolves([
      assessment1, assessment2, assessment3
    ]);

    challengeRepository.list.resolves([
      challengeForSkillCitation4,
      archivedChallengeForSkillCitation4,
      challengeForSkillCitation4AndMoteur3,
      challengeForSkillCollaborer4,
      challengeForSkillRecherche4,
      challengeForSkillRemplir2,
      challengeForSkillRemplir4,
      challengeForSkillUrl3,
      challengeForSkillWeb1,
      challengeRecordWithoutSkills,
      oldChallengeWithAlreadyValidatedSkill
    ]);
    answerRepository.findCorrectAnswersByAssessment.resolves(answerCollectionWithEmptyData);
    competenceRepository.list.resolves([
      competenceFlipper,
      competenceDauphin
    ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should load achieved assessments', () => {
    // when
    const promise = getProfileToCertify({ userId, limitDate: '2020-10-27 08:44:25', answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

    // then
    return promise.then(() => {
      sinon.assert.calledOnce(assessmentRepository.findLastCompletedAssessmentsForEachCoursesByUser);
      sinon.assert.calledWith(assessmentRepository.findLastCompletedAssessmentsForEachCoursesByUser, userId, '2020-10-27 08:44:25');
    });
  });

  it('should list available challenges', () => {
    // when
    const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

    // then
    return promise.then(() => {
      sinon.assert.called(challengeRepository.list);
    });
  });

  it('should list right answers for every assessment fulfilled', () => {
    // when
    const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

    // then
    return promise.then(() => {
      sinon.assert.called(answerRepository.findCorrectAnswersByAssessment);
    });
  });

  it('should not list right answers for assessments that have an estimated level null or 1', () => {
    // when
    const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

    // then
    return promise.then(() => {
      sinon.assert.neverCalledWith(answerRepository.findCorrectAnswersByAssessment, assessment3.id);
    });
  });

  it('should list available competences', () => {
    // when
    const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

    // then
    return promise.then(() => {
      sinon.assert.called(competenceRepository.list);
    });
  });

  context('when all informations needed are collected', () => {

    it('should assign skill to related competence', () => {
      // given
      const answerInstance = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
      const answerCollectionWithOneAnswer = AnswerCollection.forge([answerInstance]);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionWithOneAnswer);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [skillRemplir2],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: [challengeForSkillRemplir2]
          }]);
      });
    });

    context('when selecting challenges to validate the skills per competence', () => {

      context('when no challenge validate the skill', () => {

        it('should not return the skill', () => {
          // given
          const answerOfOldChallenge = new BookshelfAnswer({
            challengeId: oldChallengeWithAlreadyValidatedSkill.id,
            result: 'ok'
          });
          const answerCollectionWithOneAnswer = AnswerCollection.forge([answerOfOldChallenge]);

          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithOneAnswer);
          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionWithEmptyData);

          // when
          const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

          // then
          return promise.then((skillProfile) => {
            expect(skillProfile).to.deep.equal([{
              id: 'competenceRecordIdOne',
              index: '1.1',
              name: '1.1 Construire un flipper',
              pixScore: 12,
              estimatedLevel: 1,
              skills: [],
              challenges: []
            }, {
              id: 'competenceRecordIdTwo',
              index: '1.2',
              name: '1.2 Adopter un dauphin',
              pixScore: 23,
              estimatedLevel: 2,
              skills: [],
              challenges: []
            }]);
          });
        });
      });

      context('when only one challenge validate the skill', () => {

        it('should select the same challenge', () => {
          // given
          const answer = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
          const answerCollectionWithOneAnswer = AnswerCollection.forge([answer]);

          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionWithOneAnswer);

          // when
          const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

          // then
          return promise.then((skillProfile) => {
            expect(skillProfile).to.deep.equal([
              {
                id: 'competenceRecordIdOne',
                index: '1.1',
                name: '1.1 Construire un flipper',
                skills: [],
                pixScore: 12,
                estimatedLevel: 1,
                challenges: []
              },
              {
                id: 'competenceRecordIdTwo',
                index: '1.2',
                name: '1.2 Adopter un dauphin',
                skills: [skillRemplir2],
                pixScore: 23,
                estimatedLevel: 2,
                challenges: [challengeForSkillRemplir2]
              }]);
          });
        });
      });

      context('when three challenges validate the same skill', () => {

        it('should select the unanswered challenge which is published', () => {
          // given
          const answer = new BookshelfAnswer({ challengeId: challengeForSkillCitation4.id, result: 'ok' });
          const answerCollectionWithOneAnswer = AnswerCollection.forge([answer]);

          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithOneAnswer);
          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionWithEmptyData);

          // when
          const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

          // then
          return promise.then((skillProfile) => {
            expect(skillProfile).to.deep.equal([
              {
                id: 'competenceRecordIdOne',
                index: '1.1',
                name: '1.1 Construire un flipper',
                skills: [skillCitation4],
                pixScore: 12,
                estimatedLevel: 1,
                challenges: [challengeForSkillCitation4AndMoteur3]
              },
              {
                id: 'competenceRecordIdTwo',
                index: '1.2',
                name: '1.2 Adopter un dauphin',
                skills: [],
                pixScore: 23,
                estimatedLevel: 2,
                challenges: []
              }]);
          });
        });

        it('should select a challenge for every skill', () => {
          // given
          const answer = new BookshelfAnswer({ challengeId: challengeForSkillRecherche4.id, result: 'ok' });
          const answer2 = new BookshelfAnswer({ challengeId: challengeForSkillCitation4AndMoteur3.id, result: 'ok' });
          const answerCollectionWithTwoAnswers = AnswerCollection.forge([answer, answer2]);

          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithTwoAnswers);
          answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionWithEmptyData);

          // when
          const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

          // then
          return promise.then((skillProfile) => {
            expect(skillProfile).to.deep.equal([
              {
                id: 'competenceRecordIdOne',
                index: '1.1',
                name: '1.1 Construire un flipper',
                skills: [skillCitation4, skillRecherche4, skillMoteur3],
                pixScore: 12,
                estimatedLevel: 1,
                challenges: [challengeForSkillCitation4, challengeForSkillRecherche4, challengeForSkillCitation4AndMoteur3]
              },
              {
                id: 'competenceRecordIdTwo',
                index: '1.2',
                name: '1.2 Adopter un dauphin',
                skills: [],
                pixScore: 23,
                estimatedLevel: 2,
                challenges: []
              }]);
          });
        });
      });
    });

    it('should group skills by competence ', () => {
      // given
      const answerA1 = new BookshelfAnswer({ challengeId: challengeForSkillRecherche4.id, result: 'ok' });
      const answerCollectionA = AnswerCollection.forge([answerA1]);

      const answerB1 = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
      const answerB2 = new BookshelfAnswer({ challengeId: challengeForSkillUrl3.id, result: 'ok' });
      const answerCollectionB = AnswerCollection.forge([answerB1, answerB2]);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionA);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionB);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [skillRecherche4],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: [challengeForSkillRecherche4]
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [skillUrl3, skillRemplir2],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: [challengeForSkillUrl3, challengeForSkillRemplir2]
          }]);
      });
    });

    it('should sort in desc grouped skills by competence', () => {
      // given
      const answer1 = new BookshelfAnswer({ challengeId: challengeForSkillRemplir4.id, result: 'ok' });
      const answer2 = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
      const answer3 = new BookshelfAnswer({ challengeId: challengeForSkillUrl3.id, result: 'ok' });
      const answerCollectionArray = AnswerCollection.forge([answer1, answer2, answer3]);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionArray);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [skillRemplir4, skillUrl3, skillRemplir2],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: [challengeForSkillRemplir4, challengeForSkillUrl3, challengeForSkillRemplir2]
          }
        ]);
      });
    });

    it('should return the three most difficult skills sorted in desc grouped by competence', () => {
      // given
      const answer1 = new BookshelfAnswer({ challengeId: challengeForSkillRemplir4.id, result: 'ok' });
      const answer2 = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
      const answer3 = new BookshelfAnswer({ challengeId: challengeForSkillUrl3.id, result: 'ok' });
      const answer4 = new BookshelfAnswer({ challengeId: challengeForSkillWeb1.id, result: 'ok' });
      const answerCollectionArray = AnswerCollection.forge([answer1, answer2, answer3, answer4]);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionArray);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [skillRemplir4, skillUrl3, skillRemplir2],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: [challengeForSkillRemplir4, challengeForSkillUrl3, challengeForSkillRemplir2]
          }
        ]);
      });
    });

    it('should not add a skill twice', () => {
      // given
      const answer = new BookshelfAnswer({ challengeId: challengeForSkillRemplir2.id, result: 'ok' });
      const answerCollectionArray = AnswerCollection.forge([answer, answer]);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionArray);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [skillRemplir2],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: [challengeForSkillRemplir2]
          }]);
      });
    });

    it('should not assign skill, when the challenge id is not found', () => {
      // given
      const answer = new BookshelfAnswer({ challengeId: 'challengeRecordIdThatDoesNotExist', result: 'ok' });
      const answerCollectionArray = AnswerCollection.forge(answer);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionArray);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: []
          }]);
      });
    });

    it('should not assign skill, when the competence is not found', () => {
      // given
      const answer = new BookshelfAnswer({ challengeId: 'challengeRecordIdThree', result: 'ok' });
      const answerCollectionArray = AnswerCollection.forge(answer);

      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment1.id).resolves(answerCollectionWithEmptyData);
      answerRepository.findCorrectAnswersByAssessment.withArgs(assessment2.id).resolves(answerCollectionArray);

      // when
      const promise = getProfileToCertify({ userId, answerRepository, assessmentRepository, courseRepository, challengeRepository, competenceRepository });

      // then
      return promise.then((skillProfile) => {
        expect(skillProfile).to.deep.equal([
          {
            id: 'competenceRecordIdOne',
            index: '1.1',
            name: '1.1 Construire un flipper',
            skills: [],
            pixScore: 12,
            estimatedLevel: 1,
            challenges: []
          },
          {
            id: 'competenceRecordIdTwo',
            index: '1.2',
            name: '1.2 Adopter un dauphin',
            skills: [],
            pixScore: 23,
            estimatedLevel: 2,
            challenges: []
          }]);
      });
    });
  });
});