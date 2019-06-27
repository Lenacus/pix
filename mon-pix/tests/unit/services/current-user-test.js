import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import Service from '@ember/service';
import sinon from 'sinon';

describe('Unit | Service | current-user', function() {
  setupTest();

  let storeStub;
  let sessionStub;

  describe('user is authenticated', function() {
    beforeEach(function() {
      storeStub = Service.create({ isAuthenticated: true });
      sessionStub = Service.create({
        queryRecord: sinon.stub().resolves({ id: 1 })
      });
    });

    it('should load the current user', async function() {
      // Given
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.set('store', storeStub);
      currentUser.set('session', sessionStub);

      // When
      await currentUser.load();

      // Then
      expect(currentUser.user).to.be.defined;
    });
  });

  describe('user is not authenticated', function() {

    beforeEach(function() {
      sessionStub = Service.create({ isAuthenticated: false });
    });

    it('should do nothing', async function() {
      // Given
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.set('store', storeStub);
      currentUser.set('session', sessionStub);
      // When
      await currentUser.load();

      // Then
      expect(currentUser.user).to.be.undefined;
    });
  });

  describe('user token is expired', function() {

    beforeEach(function() {
      sessionStub =  Service.create({
        isAuthenticated: true,
        invalidate: sinon.stub().resolves('invalidate'),
      });
      storeStub = Service.create({
        queryRecord: sinon.stub().rejects({ errors: [{ code: 401 }] })
      });
    });

    it('should redirect to login', async function() {
      // Given
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.set('store', storeStub);
      currentUser.set('session', sessionStub);
      // When
      const result = await currentUser.load();

      // Then
      expect(result).to.equal('invalidate');
    });
  });
});
