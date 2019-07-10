import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import _ from 'lodash';
import answersAsObject from 'mon-pix/utils/answers-as-object';
import labelsAsObject from 'mon-pix/utils/labels-as-object';

const QrocmDepSolutionPanel = Component.extend({

  inputFields: computed('challenge.proposals', 'answer.value', function() {

    const escapedProposals = this.get('challenge.proposals').replace(/(\n\n|\n)/gm, '<br>');
    const labels = labelsAsObject(htmlSafe(escapedProposals).string);
    const answers = answersAsObject(this.get('answer.value'), _.keys(labels));

    const inputFields = [];

    _.forEach(labels, (label, labelKey) => {

      if (answers[labelKey] === '') {
        answers[labelKey] = 'Pas de réponse';
      }

      const inputField = {
        label: labels[labelKey],
        answer: answers[labelKey]
      };
      inputFields.push(inputField);
    });

    return inputFields;
  }),

  expectedAnswers: computed('solution', function() {
    return this.get('solution').split('\n')[0];
  })

});

export default QrocmDepSolutionPanel;

