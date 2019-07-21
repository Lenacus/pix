const { expect, generateValidRequestAuhorizationHeader, nock, databaseBuilder } = require('../../test-helper');
const createServer = require('../../../server');

describe('Acceptance | Controller | target-profile-controller', () => {

  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  describe('GET /organizations/{id}/target-profiles', () => {

    context('when user is authenticated', () => {

      let user;
      let linkedOrganization;

      beforeEach(async () => {
        nock.cleanAll();
        nock('https://api.airtable.com')
          .get('/v0/test-base/Acquis')
          .query(true)
          .reply(200, {});
        user = databaseBuilder.factory.buildUser({});
        linkedOrganization = databaseBuilder.factory.buildOrganization({});
        databaseBuilder.factory.buildMembership({
          userId: user.id,
          organizationId: linkedOrganization.id,
        });

        await databaseBuilder.commit();
      });

      afterEach(async () => {
        nock.cleanAll();
        await databaseBuilder.clean();
      });

      it('should return 200', () => {
        const options = {
          method: 'GET',
          url: `/api/organizations/${linkedOrganization.id}/target-profiles`,
          headers: { authorization: generateValidRequestAuhorizationHeader(user.id) },
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response) => {
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    context('when user is not authenticated', () => {

      it('should return 401', () => {
        const options = {
          method: 'GET',
          url: '/api/organizations/1/target-profiles',
          headers: { authorization: 'Bearer mauvais token' },
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response) => {
          expect(response.statusCode).to.equal(401);
        });
      });
    });
  });
});
