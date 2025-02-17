const express = require("express");
const applicantAcademicRoute = require("./applicantAcademicRoute");
const applicantAppreciationRoute = require("./applicantAppreciationRoute");
const applicantAppreciationAttachmentRoute = require("./applicantAppreciationAttachmentRoute");
const applicantJobRoute = require("./applicantJobRoute");
const applicantSkillRoute = require("./applicantSkillRoute");
const applicantUnformalRoute = require("./applicantUnformalRoute");
const applicantFormRoute = require("./applicantFormRoute");
const billTypeRoute = require("./billTypeRoute");
const divisionRoute = require("./divisionRoute");
const employeeAccountRoute = require("./employeeAccountRoute");
const employeeAnnouncementRoute = require("./employeeAnnouncementRoute");
const employeeBillRoute = require("./employeeBillRoute");
const employeePositionRoute = require("./employeePositionRoute");
const employeeRoute = require("./employeeRoute");
const employeeSalaryRoute = require("./employeeSalaryRoute");
const formPositionRoute = require("./formPositionRoute");
const employeeAttendanceRoute = require("./employeeAttendanceRoute");
const jobVacancyRoute = require("./jobVacancyRoute");
const jobVacancyDetailRoute = require("./jobVacancyDetailRoute");
const trainingAttendanceRoute = require("./trainingAttendanceRoute");
const trainingRoute = require("./trainingRoute");
const trainingSuggestionRoute = require("./trainingSuggestionRoute");
const faceRoute = require("./faceRoute");
const locationRoute = require("./locationRoute");
const formAnnouncementRoute = require("./formAnnouncementRoute");
const worktimeRoute = require("./worktimeRoute");
const employeeVacationRoute = require("./employeeVacationRoute");
const applicantInterviewRoute = require("./applicantInterviewRoute");
const employeeJobdeskRoute = require("./employeeJobdeskRoute");
const employeeAsessorRoute = require("./employeeAsessorRoute");
const employeeAttachmentRoute = require('./employeeAttachmentRoute')
const employeeOutstationRoute = require("./employeeOutstationRoute")
const downloadRoute = require('./downloadRoute')
const employeeEvaluationRoute = require('./employeeEvaluationRoute')
const employeeEvaluationItemRoute = require('./employeeEvaluationItemRoute')
const jobdeskUnitRoute = require('./jobdeskUnitRoute')
const jobdeskGradeGroupRoute = require('./jobdeskGroupGradeRoute')
const jobdeskGradeRoute = require('./jobdeskGradeRoute')

// const authRoute = require('./authRoute')
const router = express.Router();

const defaultRoutes = [
  {
    path: "/applicant-academic",
    route: applicantAcademicRoute,
  },
  {
    path: "/applicant-appreciation",
    route: applicantAppreciationRoute,
  },
  {
    path: "/applicant-appreciation-attachment",
    route: applicantAppreciationAttachmentRoute,
  },
  {
    path: "/applicant-job",
    route: applicantJobRoute,
  },
  {
    path: "/applicant-skill",
    route: applicantSkillRoute,
  },
  {
    path: "/applicant-unformal",
    route: applicantUnformalRoute,
  },
  {
    path: "/applicant-form",
    route: applicantFormRoute,
  },
  {
    path: "/bill-type",
    route: billTypeRoute,
  },
  {
    path: "/division",
    route: divisionRoute,
  },
  {
    path: "/employee-account",
    route: employeeAccountRoute,
  },
  {
    path: "/employee-asessor",
    route: employeeAsessorRoute,
  },
  {
    path: "/employee-announcement",
    route: employeeAnnouncementRoute,
  },
{
    path: "/employee-attachment",
    route: employeeAttachmentRoute,
  },
  {
    path: "/employee-bill",
    route: employeeBillRoute,
  },
  {
    path: "/employee-position",
    route: employeePositionRoute,
  },
  {
    path: "/employee-outstation",
    route: employeeOutstationRoute,
  },
  {
    path: "/employee",
    route: employeeRoute,
  },
  {
    path: "/employee-salary",
    route: employeeSalaryRoute,
  },
  {
    path: "/form-position",
    route: formPositionRoute,
  },
  {
    path: "/job-vacancy-detail",
    route: jobVacancyDetailRoute,
  },
  {
    path: "/job-vacancy",
    route: jobVacancyRoute,
  },
  {
    path: "/training-attendance",
    route: trainingAttendanceRoute,
  },
  {
    path: "/training",
    route: trainingRoute,
  },
  {
    path: "/training-suggestion",
    route: trainingSuggestionRoute,
  },
  {
    path: "/applicant-academic",
    route: applicantAcademicRoute,
  },
  {
    path: "/applicant-interview",
    route: applicantInterviewRoute,
  },
  {
    path: "/applicant-appreciation",
    route: applicantAppreciationRoute
  },
  // {
  //   path: "/auth",
  //   route: authRoute
  // },
  {
    path: "/applicant-appreciation-attachment",
    route: applicantAppreciationAttachmentRoute,
  },
  {
    path: "/applicant-job",
    route: applicantJobRoute,
  },
  {
    path: "/applicant-skill",
    route: applicantSkillRoute,
  },
  {
    path: "/applicant-unformal",
    route: applicantUnformalRoute,
  },
  {
    path: "/applicant-form",
    route: applicantFormRoute,
  },
  {
    path: "/bill-type",
    route: billTypeRoute,
  },
  {
    path: "/division",
    route: divisionRoute,
  },
  {
    path: "/employee-vacation",
    route: employeeVacationRoute,
  },
  {
    path: "/employee-account",
    route: employeeAccountRoute,
  },
  {
    path: "/employee-announcement",
    route: employeeAnnouncementRoute,
  },
  {
    path: "/employee-bill",
    route: employeeBillRoute,
  },
  {
    path: "/employee-position",
    route: employeePositionRoute,
  },
  {
    path: "/employee-jobdesk",
    route: employeeJobdeskRoute,
  },
  {
    path: "/employee",
    route: employeeRoute,
  },
  {
    path: "/employee-attendance",
    route: employeeAttendanceRoute,
  },
  {
    path: "/employee-salary",
    route: employeeSalaryRoute,
  },
  {
    path: "/form-position",
    route: formPositionRoute,
  },
  {
    path: "/form-announcement",
    route: formAnnouncementRoute,
  },
  {
    path: "/job-vacancy-detail",
    route: jobVacancyDetailRoute,
  },
  {
    path: "/job-vacancy",
    route: jobVacancyRoute,
  },
  {
    path: "/training-attendance",
    route: trainingAttendanceRoute,
  },
  {
    path: "/training",
    route: trainingRoute,
  },
  {
    path: "/worktime",
    route: worktimeRoute,
  },
  {
    path: "/training-suggestion",
    route: trainingSuggestionRoute,
  },
  {
    path: "/download",
    route: downloadRoute,
  },
    {
      path: "/employee-evaluation",
      route: employeeEvaluationRoute,
    },
  {
    path: "/evaluation-item",
    route: employeeEvaluationItemRoute,
  },
  {
    path: "/jobdesk-unit",
    route: jobdeskUnitRoute,
  },
  {
    path: "/jobdesk-grade",
    route: jobdeskGradeRoute,
  },
  {
    path: "/jobdesk-group-grade",
    route: jobdeskGradeGroupRoute,
  },
  { path: "/face", route: faceRoute },
  { path: "/location", route: locationRoute}
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
