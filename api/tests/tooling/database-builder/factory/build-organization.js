const faker = require('faker');
const buildUser = require('./build-user');
const databaseBuffer = require('../database-buffer');
const _ = require('lodash');

const buildOrganization = function buildOrganization({
  id,
  type = 'PRO',
  name = faker.company.companyName(),
  code = faker.random.alphaNumeric(),
  logoUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  userId = undefined,
  createdAt = faker.date.recent(),
  updatedAt = faker.date.recent(),
} = {}) {

  userId = _.isUndefined(userId) ? buildUser().id : userId;
  const values = {
    id,
    type,
    name,
    code,
    logoUrl,
    createdAt,
    userId,
    updatedAt
  };
  return databaseBuffer.pushInsertable({
    tableName: 'organizations',
    values,
  });
};

module.exports = buildOrganization;
