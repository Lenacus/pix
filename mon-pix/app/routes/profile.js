import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {

  currentUser: service(),

  model() {
    return this.currentUser.user;
  },

  async afterModel(user) {
    const organizations = await user.organizations;

    if (organizations.length) {
      return this.transitionTo('board');
    }

    user.belongsTo('pixScore').reload();
    user.hasMany('scorecards').reload();
    user.hasMany('campaignParticipations').reload();
  },
});
