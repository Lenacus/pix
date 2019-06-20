const faker = require('faker');

module.exports = {
  foundNextChallenge,
  getRandomCampaignId,
  setupSignupFormData,
};

function foundNextChallenge(context, next) {
  const continueLooping = !!context.vars.challengeId;
  return next(continueLooping);
}

function getRandomCampaignId(context, events, done) {
  const campaigns = context.vars['campaigns'];
  if (campaigns) {
    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    context.vars['campaignId'] = randomCampaign.id;
  }
  return done();
}

function setupSignupFormData(context, events, done) {
  context.vars['firstName'] = faker.name.firstName();
  context.vars['lastName'] = faker.name.lastName();
  context.vars['email'] = faker.internet.email();
  context.vars['password'] = 'L0rem1psum';
  return done();
}
