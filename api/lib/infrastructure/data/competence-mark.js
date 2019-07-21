const Bookshelf = require('../bookshelf');
const CompetenceMark = require('../../domain/models/CompetenceMark');

require('./assessment-result');

// id                     -   PK autoinc Integer
// level                  -   INTEGER NULLABLE
// score                  -   INTEGER NULLABLE
// area_code              -   TEXT
// competence_code        -   TEXT
// createdAt              -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// assessmentResultId     -   FK ON assessment-results.id  NULLABLE

module.exports = Bookshelf.model('CompetenceMark', {

  tableName: 'competence-marks',
  hasTimestamps: ['createdAt', null],

  assessmentResults() {
    return this.belongsTo('AssessmentResult');
  },

  toDomainEntity() {
    const model = this.toJSON();
    return new CompetenceMark(model);
  }
});
