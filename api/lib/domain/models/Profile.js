const Competence = require('./Competence');
const constants = require('../constants');
const _ = require('lodash');

// FIXME: Cet objet a trop de responsabilité (modification des compétences)
class Profile {
  constructor({
    // includes
    areas,
    assessmentsCompletedWithResults,
    competences,
    courses,
    lastAssessments,
    organizations,
    user,
    // references
  } = {}) {
    // includes
    this.areas = areas;
    this.competences = competences;
    this.organizations = organizations;
    this.user = user;
    // references

    this._setStatusToCompetences(lastAssessments, assessmentsCompletedWithResults, courses);
    this._setLevelAndPixScoreToCompetences(lastAssessments, courses);
    this._setAssessmentToCompetence(lastAssessments, courses);
    this._calculateTotalPixScore();
  }

  _setStatusToCompetences(lastAssessments, assessmentsCompletedWithResults, courses) {
    this.competences.forEach((competence) => {

      const lastAssessmentByCompetenceId = this._findAssessmentsByCompetenceId(lastAssessments, courses, competence.id);
      const assessmentsCompletedByCompetenceId = this._findAssessmentsByCompetenceId(assessmentsCompletedWithResults, courses, competence.id);

      competence.isRetryable = false;

      if (lastAssessmentByCompetenceId.length === 0) {
        competence.status = Competence.STATUSES.NOT_ASSESSED;

      } else if (!lastAssessmentByCompetenceId[0].isCompleted()) {
        competence.status = Competence.STATUSES.ASSESSMENT_NOT_COMPLETED;

      } else if (lastAssessmentByCompetenceId[0].isCompleted()) {
        competence.status = Competence.STATUSES.ASSESSED;
        const lastCompletedAssessment = _(assessmentsCompletedByCompetenceId).find({ 'id': lastAssessmentByCompetenceId[0].id });
        competence.isRetryable = lastCompletedAssessment.canStartNewAttemptOnCourse();

        if (!competence.isRetryable) {
          competence.daysBeforeNewAttempt = lastCompletedAssessment.getRemainingDaysBeforeNewAttempt();
        }
      } else {
        competence.status = Competence.STATUSES.UNKNOWN;
      }

    });
  }

  _setLevelAndPixScoreToCompetences(lastAssessments, courses) {
    lastAssessments.forEach((assessment) => {
      if (assessment.isCompleted()) {
        const courseIdFromAssessment = assessment.courseId;
        const course = this._getCourseById(courses, courseIdFromAssessment);
        const competence = this.competences.find((competence) => course.competences.includes(competence.id));

        competence.level = Math.min(assessment.getLevel(), constants.MAX_REACHABLE_LEVEL);
        competence.pixScore = assessment.getPixScore();
      }
    });
  }

  _setAssessmentToCompetence(assessments, courses) {
    assessments.forEach((assessment) => {
      const courseIdFromAssessment = assessment.courseId;
      const course = this._getCourseById(courses, courseIdFromAssessment);
      if (course) {
        const competence = this.competences.find((competence) => course.competences.includes(competence.id));
        competence.assessmentId = assessment.id;
      }
    });
  }

  _findAssessmentsByCompetenceId(assessments, courses, competenceId) {
    return assessments.filter((assessment) => {
      const courseIdFromAssessment = assessment.courseId;
      const course = this._getCourseById(courses, courseIdFromAssessment);
      return course ? course.competences.includes(competenceId) : false;
    });
  }

  _getCourseById(courses, courseIdFromAssessment) {
    return _.find(courses, (course) => {
      return course.id === courseIdFromAssessment;
    });
  }

  _calculateTotalPixScore() {
    const competencesPixScore = _.filter(this.competences, (competence) => {
      return competence.hasOwnProperty('pixScore');
    }).map((competence) => competence.pixScore);

    if (competencesPixScore.length > 0) {
      const totalPixScore = _.sum(competencesPixScore);
      this.user.set('pix-score', totalPixScore);
    }
  }
}

module.exports = Profile;
