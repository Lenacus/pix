const faker = require('faker');
const databaseBuffer = require('../database-buffer');
const encrypt = require('../../../../lib/domain/services/encryption-service');
const buildPixRole = require('./build-pix-role');
const buildUserPixRole = require('./build-user-pix-role');
const _ = require('lodash');

const buildUser = function buildUser({
  id,
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email = undefined ,
  password = undefined,
  cgu = true,
  samlId,
} = {}) {

  if (_.isUndefined(password)) {
    password = encrypt.hashPasswordSync(faker.internet.password());
  }
  else {
    password = encrypt.hashPasswordSync(password);
  }
  if (_.isUndefined(email)) {
    email = faker.internet.exampleEmail().toLowerCase();
  }
  else {
    email = email.toLowerCase();
  }
  const values = {
    id, firstName, lastName, email, password, cgu, samlId,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });
};

buildUser.withUnencryptedPassword = function buildUserWithUnencryptedPassword({
  id,
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email = faker.internet.email(),
  rawPassword = faker.internet.password(),
  cgu = true,
  samlId,
}) {

  const password = encrypt.hashPasswordSync(rawPassword);

  const values = {
    id, firstName, lastName, email, password, cgu, samlId,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });
};

buildUser.withPixRolePixMaster = function buildUserWithPixRolePixMaster({
  id,
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email = faker.internet.email(),
  password = encrypt.hashPasswordSync(faker.internet.password()),
  cgu = true,
} = {}) {

  const values = {
    id, firstName, lastName, email, password, cgu,
  };

  const pixRolePixMaster = buildPixRole({ name: 'PIX_MASTER' });

  const user = databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });

  buildUserPixRole({ userId: user.id, pixRoleId: pixRolePixMaster.id });

  return user;
};

module.exports = buildUser;
