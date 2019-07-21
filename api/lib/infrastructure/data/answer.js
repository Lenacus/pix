const Bookshelf = require('../bookshelf');

// id                         -   PK autoinc Integer
// value                      -   Text
// result                     -   Varchar NULLABLE
// assessmentId               -   FK ON assessments.id  NULLABLE
// challengeId                -   Varchar
// createdAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// timeout                    -   Integer NULLABLE
// elapsedTime                -   Integer NULLABLE
// resultDetails              -   Text   NULLABLE

require('./assessment');

module.exports = Bookshelf.model('Answer', {

  tableName: 'answers',
  hasTimestamps: ['createdAt', 'updatedAt'],

  assessment() {
    return this.belongsTo('Assessment');
  },
});
