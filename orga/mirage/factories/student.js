import { Factory, faker, association } from 'ember-cli-mirage';

export default Factory.extend({

  firstName() {
    return faker.name.firstName();
  },

  lastName() {
    return faker.name.lastName();
  },

  grade() {
    return 'CM1';
  },

  birthDate() {
    return faker.date.past(12);
  },

  organization: association(),

});
