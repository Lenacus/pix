const { expect, databaseBuilder, generateValidRequestAuhorizationHeader } = require('../../../test-helper');
const createServer = require('../../../../server');

const Membership = require('../../../../lib/domain/models/Membership');

describe('Acceptance | Controller | users-controller-get-memberships', () => {

  let userId;
  let membershipId;
  let organizationId;
  const organizationRole = Membership.roles.MEMBER;
  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  afterEach(async () => {
    await databaseBuilder.clean();
  });

  describe('GET /users/:id/memberships', () => {

    function _options(userId) {
      return {
        method: 'GET',
        url: `/api/users/${userId}/memberships`,
        headers: { authorization: generateValidRequestAuhorizationHeader(userId) },
      };
    }
    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser({}).id;
      organizationId = databaseBuilder.factory.buildOrganization(
        {
          userId,
          name: 'The name of the organization',
          type: 'SUP',
          code: 'AAA111',
        }).id;
      membershipId = databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole,
      }).id;

      await databaseBuilder.commit();
    });

    afterEach(async () => {
      await databaseBuilder.clean();
    });

    it('should return found accesses with 200 HTTP status code', () => {
      // when
      const promise = server.inject(_options(userId));

      // then
      return promise.then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: [
            {
              type: 'memberships',
              id: membershipId.toString(),
              attributes: {
                'organization-role': organizationRole,
              },
              relationships: {
                'organization': { data: { type: 'organizations', id: organizationId.toString() }, },
                'user': { data: null, },
              },
            },
          ],
          included: [
            {
              type: 'organizations',
              id: organizationId.toString(),
              attributes: {
                name: 'The name of the organization',
                type: 'SUP',
                code: 'AAA111',
              },
              relationships: {
                campaigns: {
                  links: {
                    related: `/api/organizations/${organizationId.toString()}/campaigns`
                  }
                },
                memberships: {
                  links: {
                    related: `/api/organizations/${organizationId.toString()}/memberships`
                  }
                },
                'target-profiles': {
                  links: {
                    related: `/api/organizations/${organizationId.toString()}/target-profiles`
                  }
                }
              }
            },
          ],
        });
      });
    });
  });
});
