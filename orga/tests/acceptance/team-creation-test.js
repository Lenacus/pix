import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { createUserMembershipWithRole } from '../helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Team Creation', function(hooks) {

  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it should not be accessible by an unauthenticated user', async function(assert) {
    // when
    await visit('/team/creation');

    // then
    assert.equal(currentURL(), '/connexion');
  });

  module('When user is logged in', function() {

    let user;

    module('When user is a member', function() {

      test('it should not be accessible', async function(assert) {
        // given
        user = createUserMembershipWithRole('MEMBER');
        await authenticateSession({
          user_id: user.id,
        });

        // when
        await visit('/equipe/creation');

        // then
        assert.equal(currentURL(), '/campagnes');
      });
    });

    module('When user is an owner', function() {

      test('it should be accessible', async function(assert) {
        // given
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });

        // when
        await visit('/equipe/creation');

        // then
        assert.equal(currentURL(), '/equipe/creation');
      });

      test('it should allow to add a team member and redirect to team page', async function(assert) {
        // given
        const email = 'gigi@labrochette.com';
        const addedMember = server.create('user', { firstName: 'Gigi', lastName: 'La Brochette', email, 'pixOrgaTermsOfServiceAccepted': true });
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });

        await visit('/equipe/creation');
        await fillIn('#email', email);

        // when
        await click('button[type="submit"]');

        // then
        assert.equal(server.db.memberships[1].userId, addedMember.id);
        assert.equal(server.db.memberships[1].organizationRole, 'MEMBER');
        assert.equal(currentURL(), '/equipe');
        assert.dom('.table tbody tr').exists({ count: 2 });
      });

      test('should display an empty input field after cancel and before add a team member', async function(assert) {
        // given
        const email = 'cancel&cancel.com';
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });

        await visit('/equipe/creation');
        await fillIn('#email', email);
        await click('.button--no-color');

        // when
        await visit('/equipe/creation');

        // then
        assert.dom('#email').hasText('');
      });

      test('it should display error on global form when error 500 is returned from backend', async function(assert) {
        // given
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });
        await visit('/equipe/creation');
        await server.post('/organizations/:id/add-membership',
          {
            errors: [
              {
                detail: '[Object object]',
                status: '500',
                title: 'Internal Server Error',
              }
            ]
          }, 500);
        await fillIn('#email', 'fake@email');

        // when
        await click('button[type="submit"]');

        // then
        assert.equal(currentURL(), '/equipe/creation');
        assert.dom('.alert-zone--error').exists();
        assert.dom('.alert-zone--error').hasText('Internal Server Error');
      });

      test('it should display error on global form when error 421 is returned from backend', async function(assert) {
        // given
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });
        await visit('/equipe/creation');
        server.post('/organizations/:id/add-membership',
          {
            errors: [
              {
                detail: '',
                status: '421',
                title: 'Precondition Failed',
              }
            ]
          }, 421);
        await fillIn('#email', 'fake@email');

        // when
        await click('button[type="submit"]');

        // then
        assert.equal(currentURL(), '/equipe/creation');
        assert.dom('.alert-zone--error').exists();
        assert.dom('.alert-zone--error').hasText('Ce membre a déjà été ajouté.');
      });

      test('it should display error on global form when error 404 is returned from backend', async function(assert) {
        // given
        user = createUserMembershipWithRole('OWNER');
        await authenticateSession({
          user_id: user.id,
        });
        await visit('/equipe/creation');
        server.post('/organizations/:id/add-membership',
          {
            errors: [
              {
                detail: '',
                status: '404',
                title: 'Not Found',
              }
            ]
          }, 404);
        await fillIn('#email', 'fake@email');

        // when
        await click('button[type="submit"]');

        // then
        assert.equal(currentURL(), '/equipe/creation');
        assert.dom('.alert-zone--error').exists();
        assert.dom('.alert-zone--error').hasText('Cet email n\'appartient à aucun utilisateur.');
      });
    });
  });
});
