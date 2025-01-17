import EmberObject from '@ember/object';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | result item campaign', function() {

  setupRenderingTest();

  describe('Component rendering', function() {

    const providedChallengeInstruction = 'Un QCM propose plusieurs choix, l\'utilisateur peut en choisir [plusieurs](http://link.plusieurs.url)';

    const emberChallengeObject = EmberObject.create({
      type: 'QCM',
      instruction: providedChallengeInstruction,
      proposals: '- soit possibilite A, et/ou' +
      '\n - soit possibilite B, et/ou' +
      '\n - soit possibilite C, et/ou' +
      '\n - soit possibilite D'
    });

    const answer = EmberObject.create({
      value: '2,4',
      result: 'ko',
      id: 1,
      challenge: emberChallengeObject,
      assessment: {
        id: 4
      }
    });

    beforeEach(function() {
      this.set('index', 0);
      return this.set('openComparisonWindow', () => {});
    });

    it('should exist', async function() {
      // given
      this.set('answer', '');

      // when
      await render(hbs`{{result-item-campaign answer=answer}}`);

      // then
      expect(find('.result-item-campaign')).to.exist;
    });

    it('should render an instruction with no empty content', async function() {
      // given
      this.set('answer', '');

      // when
      await render(hbs`{{result-item-campaign answer=answer}}`);

      // then
      expect(find('.result-item-campaign__instruction')).to.exist;
      expect(find('.result-item-campaign__instruction').textContent).to.contain('\n');
    });

    it('should render the challenge instruction', async function() {
      // given
      this.set('answer', answer);

      // when
      await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);

      // then
      const expectedChallengeInstruction = 'Un QCM propose plusieurs choix, l\'utilisateur peut en choisir plusieurs';
      expect(find('.result-item-campaign__instruction').textContent.trim()).to.equal(expectedChallengeInstruction);
    });

    it('should render an button when QCM', async function() {
      // given
      this.set('answer', answer);

      await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);
      // Then
      expect(find('.result-item-campaign__correction-button').textContent.trim()).to.deep.equal('Réponses et tutos');
    });

    it('should render tooltip for the answer', async function() {
      // given
      this.set('answer', answer);

      // when
      await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);

      // then
      expect(find('div[data-toggle="tooltip"]').getAttribute('data-original-title').trim()).to.equal('Réponse incorrecte');
    });

    it('should not render a tooltip when the answer is being retrieved', async function() {
      // given
      this.set('answer', null);

      // when
      await render(hbs`{{result-item-campaign answer=answer}}`);

      // then
      expect(find('div[data-toggle="tooltip"]').getAttribute('data-original-title')).to.not.exist;
    });

    it('should update the tooltip when the answer is eventually retrieved', async function() {
      // given
      this.set('answer', null);
      await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);

      // when
      this.set('answer', answer);

      // then
      expect(find('div[data-toggle="tooltip"]').getAttribute('data-original-title').trim()).to.equal('Réponse incorrecte');
    });

    it('should render tooltip with an image', async function() {
      // given
      this.set('answer', answer);

      // when
      await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);

      // Then
      expect(find('result-item-campaign__icon-img'));
    });

    [
      { status: 'ok', color:'green' },
      { status: 'ko', color:'red' },
      { status: 'aband', color:'grey' },
      { status: 'partially', color:'orange' },
      { status: 'timedout', color:'red' },
    ].forEach(function(data) {

      it(`should display the good result icon when answer's result is "${data.status}"`, async function() {
        // given
        answer.set('result', data.status);
        this.set('answer', answer);

        // when
        await render(hbs`{{result-item-campaign answer=answer openAnswerDetails=(action openComparisonWindow)}}`);

        // then
        expect(find(`.result-item-campaign__icon--${data.color}`)).to.exist;
      });
    });
  });
});
