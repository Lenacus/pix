const Bookshelf = require('../bookshelf');

require('./user');
require('./membership');
require('./target-profile-share');

// id          -   PK autoinc Integer
// type        -   TEXT
// name        -   Varchar
// createdAt   -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt   -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// userId      -   FK ON users.id  NULLABLE
// code        -   Varchar DEFAULT ''::character varying
// logoUrl     -   TEXT

module.exports = Bookshelf.model('Organization', {

  tableName: 'organizations',
  hasTimestamps: ['createdAt', 'updatedAt'],

  // TODO Remove this link, now use membership
  user() {
    return this.belongsTo('User', 'userId');
  },

  memberships() {
    return this.hasMany('Membership', 'organizationId');
  },

  targetProfileShares() {
    return this.hasMany('TargetProfileShare', 'organizationId');
  },

});
