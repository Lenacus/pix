import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({

  openComparison: null,
  contentReference: null,
  classNames: ['result-item-campaign'],

  resultItem: computed('answer.result', function() {
    if (!this.get('answer.result')) return;
    return this.contentReference[this.get('answer.result')];
  }),

  resultTooltip: computed('resultItem', function() {
    return this.resultItem ? this.resultItem.tooltip : null;
  }),

  validationImplementedForChallengeType: computed('answer.challenge.type', function() {
    const implementedTypes = [ 'QCM', 'QROC', 'QCU', 'QROCM-ind' ];
    const challengeType = this.get('answer.challenge.type');
    return implementedTypes.includes(challengeType);
  }),

  textLength: computed('', function() {
    return window.innerWidth <= 767 ? 60 : 110;
  }),

  init() {
    this._super(...arguments);
    this.contentReference = {
      ok: {
        icon: 'check-circle',
        color: 'green',
        tooltip: 'Réponse correcte'
      },
      ko: {
        icon: 'times-circle',
        color: 'red',
        tooltip: 'Réponse incorrecte'
      },
      aband: {
        icon: 'times-circle',
        color: 'grey',
        tooltip: 'Sans réponse'
      },
      partially: {
        icon: 'check-circle',
        color: 'orange',
        tooltip: 'Réponse partielle'
      },
      timedout: {
        icon: 'times-circle',
        color: 'red',
        tooltip: 'Temps dépassé'
      }
    };
  },

  didRender() {
    this._super(...arguments);

    const tooltipElement = this.$('[data-toggle="tooltip"]');
    const tooltipValue = this.resultTooltip;

    if (tooltipValue) {
      tooltipElement.tooltip({ title: tooltipValue });
    }
  },

});
