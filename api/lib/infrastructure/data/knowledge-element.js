const moment = require('moment');
const Bookshelf = require('../bookshelf');

require('./assessment');
require('./user');

// id                     -   PK autoinc Integer
// source                 -   Varchar  NULLABLE
// status                 -   Varchar  NULLABLE
// createdAt              -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// answerId               -   FK ON answers.id  NULLABLE
// assessmentId           -   FK ON assessments.id  NULLABLE
// skillId                -   Varchar NULLABLE
// earnedPix              -   Real   DEFAULT '0'::real
// userId                 -   FK ON users.id  NULLABLE
// competenceId           -   Varchar   NULLABLE

module.exports = Bookshelf.model('KnowledgeElement', {

  tableName: 'knowledge-elements',
  hasTimestamps: ['createdAt', null],

  assessment() {
    return this.belongsTo('Assessment', 'assessmentId');
  },

  user() {
    return this.belongsTo('User');
  },

  isCoveredByTargetProfile(targetProfileSkillIds) {
    return targetProfileSkillIds.includes(this.get('skillId'));
  },

  wasCreatedBefore(comparingDate) {
    const keCreatedAt = moment(this.get('createdAt'));
    return keCreatedAt.isBefore(comparingDate);
  },

  isValidated() {
    return this.get('status') === 'validated';
  },

});
