import Service from '@ember/service';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

const expectedUserId = 1;
const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJzb3VyY2UiOiJwaXgiLCJpYXQiOjE1NDUxMjg3NzcsImV4cCI6MTU0NTczMzU3N30.6Mkkstj-9SjXX4lsXrsZ2KL91Ol3kbxn6tlus2apGVY';

describe('Unit | Authenticator | simple', function() {

  setupTest();

  const requestStub = sinon.stub().resolves({
    'data': {
      'type': 'authentication',
      'attributes': {
        'user-id': expectedUserId,
        'token': expectedToken,
        'password': ''
      },
      'id': expectedUserId
    }
  });

  beforeEach(function() {
    this.owner.register('service:ajax', Service.extend({
      request: requestStub
    }));
  });

  it('should post a request to retrieve token', function() {
    // Given
    const email = 'test@example.net';
    const password = 'Hx523è9#';
    const authenticator = this.owner.lookup('authenticator:simple');

    // When
    const promise = authenticator.authenticate({ email, password });

    // Then
    return promise.then((_) => {

      sinon.assert.calledWith(requestStub, '/api/authentications');
      expect(requestStub.getCall(0).args[1]).to.deep.equal({
        method: 'POST',
        data: '{"data":{"attributes":{"password":"Hx523è9#","email":"test@example.net"}}}'
      });
    });
  });

  it('should return the token', function() {
    // Given
    const email = 'test@example.net';
    const password = 'Hx523è9#';
    const authenticator = this.owner.lookup('authenticator:simple');

    // When
    const promise = authenticator.authenticate({ email, password });

    // Then
    return promise.then((data) => {
      expect(data.userId).to.equal(expectedUserId);
      expect(data.token).to.equal(expectedToken);
      expect(data.source).to.equal('pix');
    });
  });

  it('should accept pre-generated token and userId', function() {
    // Given
    const token = expectedToken;
    const userId = expectedUserId;
    const authenticator = this.owner.lookup('authenticator:simple');

    // When
    const promise = authenticator.authenticate({ token, userId });

    // Then
    return promise.then((data) => {
      expect(data.userId).to.equal(expectedUserId);
      expect(data.token).to.equal(expectedToken);
      expect(data.source).to.equal('pix');
    });
  });

  describe('#extractDataFromToken', function() {
    it('should extract userId and source from token', function() {
      // given
      const token = 'aaa.eyJ1c2VyX2lkIjoxLCJzb3VyY2UiOiJwaXgiLCJpYXQiOjE1NDUxMjg3NzcsImV4cCI6MTU0NTczMzU3N30.bbbb';
      const authenticator = this.owner.lookup('authenticator:simple');

      // when
      const dataFromToken = authenticator.extractDataFromToken(token);

      // then
      expect(dataFromToken.user_id).to.equal(1);
      expect(dataFromToken.source).to.equal('pix');
    });
  });
});
