const Bookshelf = require('../bookshelf');

// id                         -   PK autoinc Integer
// courseId                   -   Varchar NULLABLE
// createdAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// userId                     -   FK ON users.id  NULLABLE
// type                       -   Varchar   NULLABLE
// state                      -   Text   NULLABLE
// competenceId               -   Varchar   NULLABLE

require('./answer');
require('./user');
require('./assessment-result');
require('./knowledge-element');
require('./campaign-participation');

module.exports = Bookshelf.model('Assessment', {

  tableName: 'assessments',
  hasTimestamps: ['createdAt', 'updatedAt'],

  answers() {
    return this.hasMany('Answer', 'assessmentId');
  },

  assessmentResults() {
    return this.hasMany('AssessmentResult', 'assessmentId');
  },

  knowledgeElements() {
    return this.hasMany('KnowledgeElement', 'assessmentId');
  },

  campaignParticipation() {
    return this.hasOne('CampaignParticipation', 'assessmentId');
  },

});
