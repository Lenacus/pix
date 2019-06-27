import { find, findAll } from '@ember/test-helpers';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import visitWithAbortedTransition from '../helpers/visit';
import defaultScenario from '../../mirage/scenarios/default';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';

describe('Acceptance | Checkpoint', () => {
  setupApplicationTest();
  setupMirage();

  beforeEach(function() {
    defaultScenario(this.server);
  });

  describe('With answers', () => {

    it('should display questions and links to solutions', async () => {
      // When
      await visitWithAbortedTransition('/assessments/ref_assessment_id/checkpoint');

      // then
      expect(find('.checkpoint-progression-gauge-wrapper')).to.exist;
      expect(find('.assessment-results__list')).to.exist;
      expect(findAll('.result-item-campaign')).to.have.lengthOf(4);
      expect(find('.checkpoint__continue').textContent).to.contain('Continuer mon parcours');
      expect(find('.checkpoint-no-answer')).to.not.exist;
    });
  });

  describe('Without answers', () => {

    it('should display a message indicating that there is no answers to provide', async () => {
      // When
      await visitWithAbortedTransition('/assessments/ref_assessment_id_no_answer/checkpoint?finalCheckpoint=true');

      // then
      expect(find('.checkpoint-progression-gauge-wrapper')).to.not.exist;
      expect(find('.assessment-results__list')).to.not.exist;
      expect(find('.checkpoint-no-answer')).to.exist;

      expect(find('.checkpoint__continue')).to.exist;
      expect(find('.checkpoint__continue').textContent).to.contain('Voir mes résultats');
      expect(find('.checkpoint-no-answer__info').textContent).to.contain('Vous avez déjà répondu aux questions, lors de vos parcours précédents. Vous pouvez directement accéder à vos résultats.');
    });
  });
});
