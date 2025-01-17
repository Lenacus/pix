import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({

  queryParams: ['finalCheckpoint'],
  finalCheckpoint: false,
  isShowingModal: false,
  answer: null,
  challenge: null,

  nextPageButtonText: computed('finalCheckpoint', function() {
    return this.finalCheckpoint ? 'Voir mes résultats' : 'Continuer mon parcours';
  }),

  completionPercentage: computed('finalCheckpoint', 'model.progression.completionPercentage', function() {
    return this.finalCheckpoint ? 100 : this.get('model.progression.completionPercentage');
  }),

  shouldDisplayAnswers: computed('model.answersSinceLastCheckpoints', function() {
    return !!this.get('model.answersSinceLastCheckpoints.length');
  }),

  actions: {
    openComparisonWindow(answer) {
      this.set('answer', answer);
      this.set('isShowingModal', true);
    },

    closeComparisonWindow() {
      this.set('isShowingModal', false);
    },
  }
});
