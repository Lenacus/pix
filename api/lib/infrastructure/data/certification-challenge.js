const Bookshelf = require('../bookshelf');

// id                   -   PK autoinc Integer
// createdAt            -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt            -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// challengeId          -   Varchar NULLABLE
// competenceId         -   Varchar NULLABLE
// associatedSkill      -   Varchar NULLABLE
// associatedSkillId    -   Varchar NULLABLE
// courseId             -   FK ON certification-courses.id  NULLABLE

module.exports = Bookshelf.model('CertificationChallenge', {
  tableName: 'certification-challenges',
  hasTimestamps: ['createdAt', 'updatedAt'],
});
