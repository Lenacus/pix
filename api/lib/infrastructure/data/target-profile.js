const Bookshelf = require('../bookshelf');

require('./target-profile-skill');
require('./target-profile-share');

// id               -   PK autoinc Integer
// name             -   Varchar
// isPublic         -   Boolean   DEFAULT FALSE
// organizationId   -   FK ON organizations.id  NULLABLE
// createdAt        -   Timestamptz   DEFAULT CURRENT_TIMESTAMP

module.exports = Bookshelf.model('TargetProfile', {

  tableName: 'target-profiles',
  hasTimestamps: ['createdAt', null],

  skillIds() {
    return this.hasMany('TargetProfileSkill', 'targetProfileId');
  },

  sharedWithOrganizations() {
    return this.hasMany('TargetProfileShare', 'targetProfileId');
  }
});
