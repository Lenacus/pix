const Bookshelf = require('../bookshelf');

// id                         -   PK autoinc Integer
// createdAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// level                      -   Integer NULLABLE
// pixScore                   -   Integer NULLABLE
// emitter                    -   Text
// commentForJury             -   Text   NULLABLE
// commentForOrganization     -   Text   NULLABLE
// commentForCandidate        -   Text   NULLABLE
// status                     -   Text
// juryId                     -   FK ON users.id  NULLABLE
// assessmentId               -   FK ON assessments.id  NULLABLE

require('./assessment');
require('./competence-mark');

module.exports = Bookshelf.model('AssessmentResult', {

  tableName: 'assessment-results',
  hasTimestamps: ['createdAt', null],

  validations: {
    status: [
      {
        method: 'isIn',
        error: 'Le status de la certification n\'est pas valide',
        args: ['validated', 'rejected', 'pending', 'error']
      },
    ],
  },

  assessment() {
    return this.belongsTo('Assessments');
  },

  competenceMarks() {
    return this.hasMany('CompetenceMark', 'assessmentResultId');
  }

});
