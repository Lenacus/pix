const Bookshelf = require('../bookshelf');

require('./target-profile');

// id                 -   PK autoinc Integer
// targetProfileId    -   FK ON target-profiles.id   NULLABLE
// skillId            -   Varchar

module.exports = Bookshelf.model('TargetProfileSkill', {

  tableName: 'target-profiles_skills',

  targetProfile() {
    return this.belongsTo('TargetProfile', 'targetProfileId');
  }
});
