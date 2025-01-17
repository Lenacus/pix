import EmberObject from '@ember/object';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { find, findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | competence area item', function() {
  setupRenderingTest();

  it('should render', async function() {
    // when
    await render(hbs`{{competence-by-area-item}}`);

    // then
    expect(find('.competence-by-area-item')).to.exist;
  });

  it('should render a title', async function() {
    // Given
    const competence = EmberObject.create({ name: 'competence-A', level: 1 });
    const areaWithOnlyOneCompetence = { property: 'area', value: '1. Information et données', items: [competence] };
    this.set('competenceArea', areaWithOnlyOneCompetence);
    // when
    await render(hbs`{{competence-by-area-item competenceArea=competenceArea}}`);
    // then
    expect(find('.area__name').textContent.trim()).to.equal('Information et données');
  });

  it('should render as many competences as received', async function() {
    // given
    const competencesWithSameArea = [
      EmberObject.create({ id: 1, name: 'competence-name-1', area: 'area-id-1' }),
      EmberObject.create({ id: 2, name: 'competence-name-2', area: 'area-id-1' }),
      EmberObject.create({ id: 3, name: 'competence-name-3', area: 'area-id-1' }),
      EmberObject.create({ id: 4, name: 'competence-name-4', area: 'area-id-1' }),
      EmberObject.create({ id: 5, name: 'competence-name-5', area: 'area-id-1' })
    ];
    const areaWithManyCompetences = {
      property: 'area',
      value: 'Information et données',
      items: competencesWithSameArea
    };

    this.set('competenceArea', areaWithManyCompetences);
    // when
    await render(hbs`{{competence-by-area-item competenceArea=competenceArea}}`);

    // then
    expect(findAll('.competence__name')).to.have.lengthOf(5);
  });

  describe('Competence rendering', function() {
    it('should render its name', async function() {
      // given
      const competence = EmberObject.create({ name: 'Mener une recherche et une veille d’information' });
      const areaWithOnlyOneCompetence = { property: 'area', value: '1. Information et données', items: [competence] };
      this.set('competenceArea', areaWithOnlyOneCompetence);

      // when
      await render(hbs`{{competence-by-area-item competenceArea=competenceArea}}`);

      // then
      expect(find('.competence__name').textContent.trim()).to.equal('Mener une recherche et une veille d’information');
    });

    it('should render the relative level progress bar for user', async function() {
      // given
      const competence = EmberObject.create();
      const areaWithOnlyOneCompetence = { property: 'area', value: '1. Information et données', items: [competence] };
      this.set('competenceArea', areaWithOnlyOneCompetence);

      // when
      await render(hbs`{{competence-by-area-item competenceArea=competenceArea}}`);

      // then
      expect(find('.competence__progress-bar')).to.exist;
    });
  });
});
