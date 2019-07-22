import DS from 'ember-data';

export default DS.Model.extend({
  lastName: DS.attr('string'),
  firstName: DS.attr('string'),
  grade: DS.attr('string'),
  birthDate: DS.attr('date')
});
