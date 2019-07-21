const Bookshelf = require('../bookshelf');

require('./assessment');

// id                     -   PK autoinc Integer
// content                -   TEXT
// assessmentId           -   FK ON assessments.id  NULLABLE
// challengeId            -   Varchar
// createdAt              -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updated                -   Timestamptz   DEFAULT CURRENT_TIMESTAMP

module.exports = Bookshelf.model('Feedback', {

  tableName: 'feedbacks',
  hasTimestamps: ['createdAt', 'updatedAt'],

  assessment() {
    return this.belongsTo('Assessment');
  }

});
