import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Component | scoring-panel', function() {

  setupTest();

  describe('#hasATrophy', function() {

    it('should be true when level is more than 0', function() {
      // given
      const assessmentWithTrophy = { estimatedLevel: 1 };
      const component = this.owner.lookup('component:scoring-panel');

      // when
      component.set('assessment', assessmentWithTrophy);
      const hasATrophy = component.get('hasATrophy');

      // then
      expect(hasATrophy).to.be.equal(true);
    });

    it('should be false when level is equal to 0', function() {
      // given
      const assessmentWithNoTrophy = { estimatedLevel: 0 };
      const component = this.owner.lookup('component:scoring-panel');

      // when
      component.set('assessment', assessmentWithNoTrophy);
      const hasATrophy = component.get('hasATrophy');

      // then
      expect(hasATrophy).to.be.equal(false);
    });
  });

  describe('#hasSomePix', function() {

    it('should be true when pix score is more than 0', function() {
      // given
      const assessmentWithPix = { pixScore: 1 };
      const component = this.owner.lookup('component:scoring-panel');

      // when
      component.set('assessment', assessmentWithPix);
      const hasSomePix = component.get('hasSomePix');

      // then
      expect(hasSomePix).to.be.equal(true);
    });

    it('should be false when pix score is equal to 0', function() {
      // given
      const assessmentWithNoPix = { pixScore: 0 };
      const component = this.owner.lookup('component:scoring-panel');

      // when
      component.set('assessment', assessmentWithNoPix);
      const hasSomePix = component.get('hasSomePix');

      // then
      expect(hasSomePix).to.be.equal(false);
    });
  });

});
