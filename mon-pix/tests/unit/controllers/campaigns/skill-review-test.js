import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Controller | Campaigns | Skill Review', function() {

  setupTest();

  let controller;

  beforeEach(function() {
    controller = this.owner.lookup('controller:campaigns/skill-review');

    const setStub = sinon.stub();

    controller.set('model', {
      campaignParticipation: {
        isShared: false,
        set: setStub,
        save: sinon.stub().resolves({})
      }
    });
    controller.set('showButtonToShareResult', true);
  });

  describe('#shareCampaignParticipation', function() {
    it('should set isShared to true', function() {
      // when
      controller.actions.shareCampaignParticipation.call(controller);

      // then
      sinon.assert.calledWith(controller.get('model.campaignParticipation.set'), 'isShared', true);
    });

    it('should set showButtonToShareResult to false', async function() {
      // when
      await controller.actions.shareCampaignParticipation.call(controller);

      // then
      expect(controller.get('showButtonToShareResult')).to.equal(false);
    });
  });

  describe('#hideShareButton', function() {
    it('should set showButtonToShareResult to false', async function() {
      // when
      await controller.actions.shareCampaignParticipation.call(controller);

      // then
      expect(controller.get('showButtonToShareResult')).to.equal(false);
    });
  });

});
