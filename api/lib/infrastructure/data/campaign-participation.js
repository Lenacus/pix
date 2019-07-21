const Bookshelf = require('../bookshelf');

require('./assessment');
require('./campaign');
require('./user');

// id                       -   PK autoinc Integer
// createdAt                -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// sharedAt                 -   Timestamptz   NULLABLE  DEFAULT CURRENT_TIMESTAMP
// campaignId               -   FK ON campaigns.id  NULLABLE
// assessmentId             -   FK ON assessments.id  NULLABLE
// userId                   -   FK ON users.id  NULLABLE
// participantExternalId    -   Varchar NULLABLE
// isShared                 -   Boolean   DEFAULT False

// UNIQUE CONSTRAINT on couple ('userId', 'campaignId')

module.exports = Bookshelf.model('CampaignParticipation', {

  tableName: 'campaign-participations',
  hasTimestamps: ['createdAt', null],

  assessment() {
    return this.belongsTo('Assessment', 'assessmentId');
  },

  campaign() {
    return this.belongsTo('Campaign', 'campaignId');
  },

  user() {
    return this.belongsTo('User', 'userId');
  },

  parse(rawAttributes) {
    if (rawAttributes && rawAttributes.sharedAt) {
      rawAttributes.sharedAt = new Date(rawAttributes.sharedAt);
    }

    return rawAttributes;
  },
});
