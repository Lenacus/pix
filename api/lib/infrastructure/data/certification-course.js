const Bookshelf = require('../bookshelf');

require('./assessment');
require('./certification-challenge');
require('./session');

// id                   -   PK autoinc Integer
// createdAt            -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// updatedAt            -   Timestamptz   DEFAULT CURRENT_TIMESTAMP
// userId               -   FK ON users.id  NULLABLE
// completedAt          -   Timestamptz   NULLABLE
// firstName            -   Varchar   NULLABLE
// lastName             -   Varchar   NULLABLE
// birthdate            -   Date   NULLABLE
// birthplace           -   Varchar   NULLABLE
// sessionid            -   FK ON sessions.id  NULLABLE
// externalId           -   Varchar   NULLABLE
// isPublished          -   Boolean  DEFAULT False
// isV2Certification    -   Boolean   DEFAULT False

module.exports = Bookshelf.model('CertificationCourse', {
  tableName: 'certification-courses',
  hasTimestamps: ['createdAt', 'updatedAt'],

  parse(rawAttributes) {
    if (rawAttributes.completedAt) {
      rawAttributes.completedAt = new Date(rawAttributes.completedAt);
    }

    if (rawAttributes.birthdate) {
      rawAttributes.birthdate = new Date(rawAttributes.birthdate);
    }

    return rawAttributes;
  },

  assessment() {
    return this.hasOne('Assessment', 'courseId');
  },

  challenges() {
    return this.hasMany('CertificationChallenge', 'courseId');
  },

  session() {
    return this.belongsTo('Session', 'sessionId');
  }
});
