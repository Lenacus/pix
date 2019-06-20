const faker = require('faker');

module.exports = {
  foundNextChallenge,
  getRandomCampaignId,
  getRandomLogin,
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

function getRandomLogin(context, events, done) {
  const userIds = [78181,138437, 29539, 29539, 55715, 29539, 21756, 17702, 51172, 21756, 31148, 21756, 21756, 21756, 5330, 5330, 21756, 31148, 155735, 31148, 21756, 21756, 31148, 28173, 253152, 192739, 151679, 221196, 31148, 60177]
  const userId = userIds[Math.floor(Math.random() * userIds.length)];
  context.vars['username'] = `${userId}@pix.fr`;
  context.vars['password'] = 'pix123';
  return done();
}

function setupSignupFormData(context, events, done) {
  context.vars['firstName'] = faker.name.firstName();
  context.vars['lastName'] = faker.name.lastName();
  context.vars['email'] = faker.internet.email();
  context.vars['password'] = 'L0rem1psum';
  return done();
}
