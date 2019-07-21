const Bookshelf = require('../bookshelf');

// id              -   PK autoinc Integer
// name            -   Varchar
// createdAt       -   Timestamptz   DEFAULT CURRENT_TIMESTAMP

module.exports = Bookshelf.model('CertificationCenter', {

  tableName: 'certification-centers',
  hasTimestamps: ['createdAt', null],

  certificationCenterMemberships() {
    return this.hasMany('CertificationCenterMembership', 'certificationCenterId');
  },

});
