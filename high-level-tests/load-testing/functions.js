const faker = require('faker');

module.exports = {
  foundNextChallenge,
  getRandomCampaignId,
  getRandomCampaignParticipation,
  getThinkingTime,
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
    if (randomCampaign) {
      context.vars['campaignId'] = randomCampaign.id;
    }
  }
  return done();
}

function getRandomCampaignParticipation(context, events, done) {
  const campaignParticipations = context.vars['campaignParticipations'];
  if (campaignParticipations) {
    const randomCampaignParticipation = campaignParticipations[
      Math.floor(Math.random() * campaignParticipations.length)
    ];
    if (randomCampaignParticipation) {
      context.vars['campaignParticipationId'] = randomCampaignParticipation.id;
    }
  }
  return done();
}

function getThinkingTime(context, events, done) {
  const minOrder = context.vars['minThinkingTime'];
  const maxOrder = context.vars['maxThinkingTime'];

  if (context.vars['needRandomThinkingTime'] === true) {
    const min = Math.ceil(minOrder);
    const max = Math.floor(maxOrder);
    context.vars['thinkingTime'] = Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    context.vars['thinkingTime'] = Math.floor((minOrder + maxOrder) / 2);
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
