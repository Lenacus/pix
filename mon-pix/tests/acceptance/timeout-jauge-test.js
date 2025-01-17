import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import $ from 'jquery';

function visitTimedChallenge() {
  visit(TIMED_CHALLENGE_URI);
  andThen(() => {
    const buttonConfirm = findWithAssert(CHALLENGE_ITEM_WARNING_BUTTON);
    buttonConfirm.click();
  });
}

const TIMED_CHALLENGE_URI = '/assessments/ref_assessment_id/challenges/ref_qcm_challenge_id';
const CHALLENGE_ITEM_WARNING_BUTTON = '.challenge-item-warning button';

describe('Acceptance | Timeout Gauge', function() {

  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  describe('Displaying the gauge', function() {
    //XXX: Deux cas car on test aussi une absence d'affichage
    it('should only display the gauge if required', function() {
      visitTimedChallenge();
      andThen(() => {
        expect($('.timeout-jauge')).to.have.lengthOf(1);
      });
      visit('/assessments/ref_assessment_id/challenges/ref_qcu_challenge_id');
      andThen(() => {
        expect($('.timeout-jauge')).to.have.lengthOf(0);
      });
    });
  });
});
