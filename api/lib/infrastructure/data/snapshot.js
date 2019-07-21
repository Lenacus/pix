const Bookshelf = require('../bookshelf');

require('./organization');
require('./user');

// id                  -   PK autoinc Integer
// organizationId      -   FK ON organizations.id  NULLABLE
// userId              -   FK ON users.id  NULLABLE
// score               -   Varchar  NULLABLE
// profile             -   JSON
// createdAt           -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt           -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// studentCode         -   Varchar  NULLABLE
// campaignCode        -   Varchar  NULLABLE
// testsFinished       -   Integer  NULLABLE

module.exports = Bookshelf.model('Snapshot', {
  tableName: 'snapshots',
  hasTimestamps: ['createdAt', 'updatedAt'],

  organization() {
    return this.belongsTo('Organization', 'organizationId');
  },

  user() {
    return this.belongsTo('User', 'userId');
  }
});
