const odsService = require('../services/ods-service');
const xmlService = require('../services/xml-service');
const { UserNotAuthorizedToAccessEntity } = require('../errors');
const moment = require('moment');
const pipe = require('lodash/fp/pipe');
const _ = require('lodash');

const ATTENDANCE_SHEET_TEMPLATE_VALUES = [
  {
    placeholder: 'SESSION_ID',
    propertyName: 'id',
  },
  {
    placeholder: 'SESSION_START_DATE',
    propertyName: 'date',
  },
  {
    placeholder: 'SESSION_START_TIME',
    propertyName: 'startTime',
  },
  {
    placeholder: 'SESSION_END_TIME',
    propertyName: 'endTime',
  },
  {
    placeholder: 'SESSION_ADDRESS',
    propertyName: 'address',
  },
  {
    placeholder: 'SESSION_ROOM',
    propertyName: 'room',
  },
  {
    placeholder: 'SESSION_EXAMINER',
    propertyName: 'examiner',
  },
  {
    placeholder: 'CERTIFICATION_CENTER_NAME',
    propertyName: 'certificationCenterName',
  },
];

const ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES = [
  {
    placeholder: 'INCREMENT',
    propertyName: 'increment',
  },
  {
    placeholder: 'LAST_NAME',
    propertyName: 'lastName',
  },
  {
    placeholder: 'FIRST_NAME',
    propertyName: 'firstName',
  },
  {
    placeholder: '01/01/2001',
    propertyName: 'birthdate',
  },
  {
    placeholder: 'BIRTH_CITY',
    propertyName: 'birthCity',
  },
  {
    placeholder: 'EXTERNAL_ID',
    propertyName: 'externalId',
  },
  {
    placeholder: '777',
    propertyName: 'extraTimePercentage',
  },
];

const EXTRA_EMPTY_CANDIDATE_ROWS = 15;

module.exports = getAttendanceSheet;

async function getAttendanceSheet({ userId, sessionId, sessionRepository, certificationCandidateRepository }) {

  try {
    await sessionRepository.ensureUserHasAccessToSession(userId, sessionId);
  } catch (err) {
    throw new UserNotAuthorizedToAccessEntity(sessionId);
  }

  const [ stringifiedXml, session, certificationCandidates ] = await Promise.all([
    odsService.getContentXml({ odsFilePath: _getAttendanceTemplatePath() }),
    sessionRepository.get(sessionId),
    certificationCandidateRepository.findBySessionId(sessionId),
  ]);

  const updatedStringifiedXml = pipe(
    _updateXmlWithSession(session),
    _updateXmlWithCertificationCandidates(certificationCandidates)
  )(stringifiedXml);

  return await odsService.makeUpdatedOdsByContentXml({ stringifiedXml: updatedStringifiedXml, odsFilePath: _getAttendanceTemplatePath() });
}

function _updateXmlWithSession(session) {
  return (stringifiedXml) => {
    const sessionData = _.transform(session, transformSessionIntoAttendanceSheetData);
    return xmlService.getUpdatedXmlWithSessionData({
      stringifiedXml,
      dataToInject: sessionData,
      templateValues: ATTENDANCE_SHEET_TEMPLATE_VALUES,
    });
  };
}

function _updateXmlWithCertificationCandidates(certificationCandidates) {
  return (stringifiedXml) => {
    let incrementCount = 1;
    const candidatesAttendanceSheetData = _.map(certificationCandidates, (candidate) => {
      const candidateAttendanceSheetData = _.transform(candidate, transformCandidateIntoAttendanceSheetData);
      candidateAttendanceSheetData.increment = incrementCount;
      ++incrementCount;
      return candidateAttendanceSheetData;
    });
    _.times(EXTRA_EMPTY_CANDIDATE_ROWS, () => {
      const emptyCandidateSheetData = {};
      _.each(ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES, (templateVal) => {
        emptyCandidateSheetData[templateVal.propertyName] = '';
      });
      emptyCandidateSheetData.increment = incrementCount;
      ++incrementCount;
      candidatesAttendanceSheetData.push(emptyCandidateSheetData);
    });
    return xmlService.getUpdatedXmlWithCertificationCandidatesData({
      stringifiedXml,
      candidatesDataToInject: candidatesAttendanceSheetData,
      templateValues: ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
    });
  };
}

function transformSessionIntoAttendanceSheetData(attendanceSheetData, value, prop) {
  switch (prop) {
    case 'certificationCenter':
      attendanceSheetData.certificationCenterName = value;
      break;
    case 'time':
      attendanceSheetData.startTime = moment(value, 'HH:mm').format('HH:mm');
      attendanceSheetData.endTime = moment(value, 'HH:mm').add(moment.duration(2, 'hours')).format('HH:mm');
      break;
    default:
      attendanceSheetData[prop] = value;
  }
}

function transformCandidateIntoAttendanceSheetData(attendanceSheetData, value, prop) {
  switch (prop) {
    case 'extraTimePercentage':
      if (value === 0) {
        attendanceSheetData.extraTimePercentage = '';
      }
      else {
        attendanceSheetData.extraTimePercentage = value;
      }
      break;
    case 'birthdate':
      attendanceSheetData.birthdate = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      break;
    default:
      attendanceSheetData[prop] = value;
  }
}

function _getAttendanceTemplatePath() {
  return __dirname + '/../files/attendance_sheet_template.ods';
}
