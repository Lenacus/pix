const Bookshelf = require('../bookshelf');

// id                         -   PK autoinc Integer
// createdAt                  -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// userId                     -   FK ON users.id  NULLABLE
// certificationCenterId      -   FK ON certification-centers.id  NULLABLE

// UNIQUE CONSTRAINT on couple ('userId', 'certificationCenterId')

module.exports = Bookshelf.model('CertificationCenterMembership', {

  tableName: 'certification-center-memberships',
  hasTimestamps: ['createdAt', null],

  user() {
    return this.belongsTo('User', 'userId');
  },

  certificationCenter() {
    return this.belongsTo('CertificationCenter', 'certificationCenterId');
  },

});
