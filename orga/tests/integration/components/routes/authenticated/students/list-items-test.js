import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | routes/authenticated/students | list-items', function(hooks) {
  setupRenderingTest(hooks);

  test('it should display a list of students', async function(assert) {
    // given
    const students = [
      { lastName: 'La Terreur', firstName: 'Gigi', grade: 'CM1', birthDate: new Date('2010-02-01') },
      { lastName: 'L\'asticot', firstName: 'Gogo', grade: 'CM1', birthDate: new Date('2010-05-10') },
    ];

    this.set('students', students);

    // when
    await render(hbs`{{routes/authenticated/students/list-items students=students}}`);

    // then
    assert.dom('.table tbody tr').exists();
    assert.dom('.table tbody tr').exists({ count: 2 });
  });

  test('it should display the firstName,  lastName, grade and  birthDate of student', async function(assert) {
    // given
    const students = [
      { lastName: 'La Terreur', firstName: 'Gigi', grade: 'CM1', birthDate: new Date('2010-02-01') },
      { lastName: 'L\'asticot', firstName: 'Gogo', grade: 'CM1', birthDate: new Date('2010-05-10') },
    ];

    this.set('students', students);

    // when
    await render(hbs`{{routes/authenticated/students/list-items students=students}}`);

    // then
    assert.dom('.table tbody tr:first-child td:first-child').hasText('La Terreur');
    assert.dom('.table tbody tr:first-child td:nth-child(2)').hasText('Gigi');
    assert.dom('.table tbody tr:first-child td:nth-child(3)').hasText('CM1');
    assert.dom('.table tbody tr:first-child td:last-child').hasText('01/02/2010');
  });

});
