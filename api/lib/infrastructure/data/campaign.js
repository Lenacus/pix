const Bookshelf = require('../bookshelf');

require('./assessment');
require('./campaign-participation');
require('./organization');
require('./target-profile');
require('./user');

// id                       -   PK autoinc Integer
// name                     -   Varchar
// code                     -   Varchar   ''::character varying
// organizationId           -   FK ON organizations.id  NULLABLE
// creatorId                -   FK ON users.id  NULLABLE
// createdAt                -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// targetProfileId          -   FK ON target-profiles.id  NULLABLE
// idPixLabel               -   Varchar NULLABLE
// title                    -   Varchar NULLABLE
// customLandingPageText    -   Text   NULLABLE

module.exports = Bookshelf.model('Campaign', {

  tableName: 'campaigns',
  hasTimestamps: ['createdAt', null],

  campaignParticipations() {
    return this.hasMany('CampaignParticipation', 'campaignId');
  },

  targetProfile: function() {
    return this.belongsTo('TargetProfile', 'targetProfileId');
  },
});
