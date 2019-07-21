const Bookshelf = require('../bookshelf');

require('./organization');

// id                  -   PK autoinc Integer
// userId              -   FK ON users.id  NULLABLE
// organizationId      -   FK ON organizations.id  NULLABLE
// organizationRole    -   Varchar  DEFAULT 'MEMBER'::character varying

module.exports = Bookshelf.model('Membership', {

  tableName: 'memberships',

  user() {
    return this.belongsTo('User', 'userId');
  },

  organization() {
    return this.belongsTo('Organization', 'organizationId');
  },

});
