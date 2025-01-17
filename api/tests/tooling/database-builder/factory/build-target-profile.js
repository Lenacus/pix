const faker = require('faker');
const buildOrganization = require('./build-organization');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

module.exports = function buildTargetProfile({
  id,
  name = faker.name.jobTitle(),
  isPublic = faker.random.boolean(),
  organizationId,
} = {}) {

  organizationId = _.isNil(organizationId) ? buildOrganization().id : organizationId;

  const values = {
    id,
    name,
    isPublic,
    organizationId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profiles',
    values,
  });
};
