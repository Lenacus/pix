const Bookshelf = require('../bookshelf');
require('./certification-course');

// id                      -   PK autoinc Integer
// certificationCenter     -   TEXT
// address                 -   TEXT
// room                    -   TEXT
// examiner                -   TEXT
// date                    -   Date
// time                    -   Time without timzone
// description             -   TEXT   NULLABLE
// createdAt               -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// accessCode              -   Varchar   NULLABLE
// certificationCenterId   -   FK ON certification-centers.id  NULLABLE

module.exports = Bookshelf.model('Session', {
  tableName: 'sessions',
  hasTimestamps: ['createdAt', null],

  certificationCourses() {
    return this.hasMany('CertificationCourse', 'sessionId');
  },
});
