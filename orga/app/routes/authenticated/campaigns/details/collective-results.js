import Route from '@ember/routing/route';

export default Route.extend({

  async model() {
    const details = this.modelFor('authenticated.campaigns.details');
    await details.belongsTo('campaignCollectiveResult').reload();

    return details;
  }

});
