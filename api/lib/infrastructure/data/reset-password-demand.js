const Bookshelf = require('../bookshelf');

require('./user');

// id               -   PK autoinc Integer
// email            -   Varchar   NULLABLE
// temporaryKey     -   Varchar   NULLABLE
// used             -   Boolean   NULLABLE   DEFAULT FALSE
// createdAt        -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt        -   Timestamptz   DEFAULT CURRENT_TIMESTAMP

module.exports = Bookshelf.model('ResetPasswordDemand', {
  tableName: 'reset-password-demands',
  hasTimestamps: ['createdAt', 'updatedAt'],

  user() {
    return this.belongsTo('User', 'email');
  }
});
