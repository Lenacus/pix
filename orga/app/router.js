import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () => {
      window.scrollTo(0, 0);
    });
  },

});

Router.map(function() {
  this.route('login', { path: 'connexion' });

  this.route('authenticated', { path: '' }, function() {
    this.route('terms-of-service', { path: '/cgu' });
    this.route('team', { path: '/equipe' }, function() {
      this.route('list', { path: '/' });
      this.route('new', { path: '/creation' });
    });
    this.route('campaigns', { path: '/campagnes' }, function() {
      this.route('list', { path: '/' });
      this.route('new', { path: '/creation' });
      this.route('update', { path: '/:campaign_id/modification' });
      this.route('details', { path: '/:campaign_id' }, function() {
        this.route('parameters', { path: '/' });
        this.route('collective-results', { path: '/resultats-collectifs' });
        this.route('participants', { path: '/participants' }, function() {
          this.route('results', { path: '/:campaign_participation_id' });
        });
      });
    });
  });

  this.route('logout');

  if (config.environment !== 'production') {
    this.route('style-guide', { path: 'guide-de-style' });
  }

  this.route('not-found', { path: '/*path' });
});

export default Router;
