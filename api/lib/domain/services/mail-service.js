const mailJet = require('../../infrastructure/mailjet');
const ACCOUNT_CREATION_EMAIL_TEMPLATE_ID = '143620';
const RESET_PASSWORD_DEMAND_EMAIL_TEMPLATE_ID = '232827';

function sendAccountCreationEmail(email) {
  return mailJet.sendEmail({
    to: email,
    template: ACCOUNT_CREATION_EMAIL_TEMPLATE_ID,
    from: 'ne-pas-repondre@pix.fr',
    fromName: 'PIX - Ne pas répondre',
    subject: 'Création de votre compte PIX'
  });
}

function sendResetPasswordDemandEmail(email, baseUrl, temporaryKey) {
  return mailJet.sendEmail({
    to: email,
    template: RESET_PASSWORD_DEMAND_EMAIL_TEMPLATE_ID,
    from: 'ne-pas-repondre@pix.fr',
    fromName: 'PIX - Ne pas répondre',
    subject: 'Demande de réinitialisation de mot de passe PIX',
    variables: { resetUrl: `${baseUrl}/changer-mot-de-passe/${temporaryKey}` }
  });
}

module.exports = {
  sendAccountCreationEmail,
  sendResetPasswordDemandEmail
};
