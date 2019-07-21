const Bookshelf = require('../bookshelf');

require('./target-profile');

// id                 -   PK autoinc Integer
// targetProfileId    -   FK ON target-profiles.id  NULLABLE
// organizationid     -   FK ON organizations.id    NULLABLE
// createdAt          -   Timestamptz   DEFAULT CURRENT_TIMESTAMP

module.exports = Bookshelf.model('TargetProfileShare', {

  tableName: 'target-profile-shares',
  hasTimestamps: ['createdAt', null],

  targetProfile() {
    return this.belongsTo('TargetProfile', 'targetProfileId');
  },

  organization() {
    return this.belongsTo('Organization', 'organizationId');
  },
});
