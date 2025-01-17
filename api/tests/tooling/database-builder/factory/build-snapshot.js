const faker = require('faker');
const buildUser = require('./build-user');
const buildOrganization = require('./build-organization');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

module.exports = function buildSnapshot({
  id,
  profile = '{}',
  organizationId,
  userId,
  createdAt = faker.date.recent(),
} = {}) {

  organizationId = _.isNil(organizationId) ? buildOrganization().id : organizationId;
  userId = _.isNil(userId) ? buildUser().id : userId;

  const values = {
    id, profile, organizationId, userId, createdAt
  };
  return databaseBuffer.pushInsertable({
    tableName: 'snapshots',
    values,
  });
};
