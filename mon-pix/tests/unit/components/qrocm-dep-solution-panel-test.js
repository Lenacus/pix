import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Component | qrocm-dep-solution-panel', function() {

  setupTest();

  describe('#inputFields', function() {

    it('should return an array with data to display', function() {
      //Given
      const challenge = { proposals: 'content : ${smiley1}\n\ntriste : ${smiley2}' };
      const answer = { value: 'smiley1: \':)\' smiley2: \':(\'', resultDetails: 'smiley1: true\nsmiley2: true' };

      const component = this.owner.lookup('component:qrocm-dep-solution-panel');
      component.set('challenge', challenge);
      component.set('answer', answer);

      const expectedFieldsData = [{
        label: 'content : ',
        answer: ':)',
      }, {
        label: '<br>triste : ',
        answer: ':(',
      }];

      //when
      const inputFields = component.get('inputFields');

      //Then
      expect(inputFields).to.be.deep.equal(expectedFieldsData);
    });

  });

  describe('#expectedAnswers', function() {

    it('should return the first line of solution', function() {
      //Given
      const solution = 'Reponse attendue : 3, 4, 5\n groupe 1 : 3';

      const component = this.owner.lookup('component:qrocm-dep-solution-panel');
      component.set('solution', solution);

      //when
      const expectedAnswers = component.get('expectedAnswers');

      //Then
      expect(expectedAnswers).to.be.equal('Reponse attendue : 3, 4, 5');
    });
  });

});
