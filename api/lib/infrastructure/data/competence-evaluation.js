const Bookshelf = require('../bookshelf');

require('./assessment');
require('./user');

// id               -   PK autoinc Integer
// assessmentId     -   FK ON assessments.id  NULLABLE
// userId           -   FK ON users.id  NULLABLE
// competenceId     -   Varchar   NULLABLE
// createdAt        -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt        -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// status           -   Varchar   NULLABLE

module.exports = Bookshelf.model('CompetenceEvaluation', {

  tableName: 'competence-evaluations',
  hasTimestamps: ['createdAt', 'updatedAt'],

  assessment() {
    return this.belongsTo('Assessment', 'assessmentId');
  },

  user() {
    return this.belongsTo('User', 'userId');
  },
});
