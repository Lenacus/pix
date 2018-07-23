import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Service from '@ember/service';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Route | campaigns/start-or-resume', function() {

  setupTest('route:campaigns/start-or-resume', {
    needs: ['service:session', 'service:current-routed-modal']
  });

  describe('#model', function() {

    let storeStub;
    let queryStub;
    let createRecordStub;

    beforeEach(function() {
      queryStub = sinon.stub();
      createRecordStub = sinon.stub();
      storeStub = Service.extend({ query: queryStub, createRecord: createRecordStub });
      this.register('service:store', storeStub);
      this.inject.service('store', { as: 'store' });
    });

    it('should fetch all user assessments with type "SMART_PLACEMENT"', function() {
      // given
      const assessments = A([]);
      queryStub.resolves(assessments);
      const assessment = EmberObject.create({ save: () => true });
      createRecordStub.returns(assessment);
      const route = this.subject();

      // when
      const promise = route.model();

      // then
      return promise.then(() => {
        sinon.assert.calledWith(queryStub, 'assessment', { filter: { type: 'SMART_PLACEMENT' } });
      });
    });

    it('should resolve with first assessment found if at least one has been found', function() {
      // given
      const assessments = A([EmberObject.create({ id: 1234 })]);
      queryStub.resolves(assessments);
      const route = this.subject();

      // when
      const promise = route.model();

      // then
      return promise.then((model) => {
        expect(model.get('id')).to.equal(1234);
      });
    });

    it('should resolve with freshly created one if no one has been found', function() {
      // given
      const assessments = A([]);
      queryStub.resolves(assessments);
      createRecordStub.returns({
        save() {
        }
      });
      const route = this.subject();

      // when
      const promise = route.model();

      // then
      return promise.then(() => {
        sinon.assert.calledWith(createRecordStub, 'assessment', { type: 'SMART_PLACEMENT' });
      });
    });
  });

  describe('#afterMoodel', function() {

    let storeStub;
    let queryRecordStub;

    beforeEach(function() {
      queryRecordStub = sinon.stub();
      storeStub = Service.extend({ queryRecord: queryRecordStub });
      this.register('service:store', storeStub);
      this.inject.service('store', { as: 'store' });
    });

    it('should force assessment reload in ortder to pre-fetch its answers', function() {
      // given
      const route = this.subject();
      route.transitionTo = sinon.stub();
      const assessment = EmberObject.create({
        reload: sinon.stub()
      });

      // when
      const promise = route.afterModel(assessment);

      // then
      return promise.then(() => {
        sinon.assert.calledOnce(assessment.reload);
      });
    });

    it('should redirect to next challenge if one was found', function() {
      // given
      const route = this.subject();
      route.transitionTo = sinon.stub();
      const assessment = EmberObject.create({ reload: () => true });
      queryRecordStub.resolves();

      // when
      const promise = route.afterModel(assessment);

      // then
      return promise.then(() => {
        sinon.assert.calledWith(route.transitionTo, 'assessments.challenge');
      });
    });

    it('should redirect to assessment rating if no next challenge was found', function() {
      // given
      const route = this.subject();
      route.transitionTo = sinon.stub();
      const assessment = EmberObject.create({ reload: () => true });
      queryRecordStub.rejects();

      // when
      const promise = route.afterModel(assessment);

      // then
      return promise.then(() => {
        sinon.assert.calledWith(route.transitionTo, 'assessments.rating');
      });
    });
  });
});