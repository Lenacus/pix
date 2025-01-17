const { ForbiddenAccess } = require('../errors');
const sessionValidator = require('../validators/session-validator');

const sessionCodeService = require('../services/session-code-service');

function _createSessionAsPixMaster(certificationCenterId, session, certificationCenterRepository, sessionRepository) {
  if (certificationCenterId) {
    return _setCertifCenterNameInSessionAndSave(session, certificationCenterId, certificationCenterRepository, sessionRepository);
  }
  return sessionRepository.save(session);
}

async function _createSessionAsNormalUser(userId, certificationCenterId, session, certificationCenterRepository, sessionRepository, userRepository) {
  const userWithCertifCenters = await userRepository.getWithCertificationCenterMemberships(userId);

  if (userWithCertifCenters.hasAccessToCertificationCenter(certificationCenterId)) {
    return _setCertifCenterNameInSessionAndSave(session, certificationCenterId, certificationCenterRepository, sessionRepository);
  }
  throw new ForbiddenAccess('User is not a member of the certification center');
}

function _setCertifCenterNameInSessionAndSave(session, certificationCenterId, certificationCenterRepository, sessionRepository) {
  return certificationCenterRepository.get(certificationCenterId)
    .then((certificationCenter) => session.certificationCenter = certificationCenter.name)
    .then(() => sessionRepository.save(session));
}

module.exports = async function createSession({ userId, session, certificationCenterRepository, sessionRepository, userRepository }) {
  sessionValidator.validate(session);

  const sessionCode = await sessionCodeService.getNewSessionCode();
  session.accessCode = sessionCode;

  const certificationCenterId = session.certificationCenterId;
  const user = await userRepository.get(userId);

  // We keep this code here so that PIX-MASTER can still create the sessions the old way through Postman, for now :)
  // To remove when we will not create sessions with no certifCenterId through Postman anymore
  if (user.hasRolePixMaster) {
    return _createSessionAsPixMaster(certificationCenterId, session, certificationCenterRepository, sessionRepository);
  }

  return _createSessionAsNormalUser(userId, certificationCenterId, session, certificationCenterRepository, sessionRepository, userRepository);
};
