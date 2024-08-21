const express = require("express");
const applicantAcademicRoute = require("./applicantAcademicRoute");
const applicantAppreciationRoute = require("./applicantAppreciationRoute");
const applicantAppreciationAttachmentRoute = require("./applicantAppreciationAttachmentRoute");
const applicantJobRoute = require("./applicantJobRoute");
const applicantSkillRoute = require("./applicantSkillRoute");
const applicantUnformalRoute = require("./applicantUnformalRoute");
const applicationFormRoute = require("./applicationFormRoute");
const billTypeRoute = require("./billTypeRoute");
const divisionRoute = require("./divisionRoute");
const employeeAccountRoute = require("./employeeAccountRoute");
const employeeAnnouncementRoute = require("./employeeAnnouncementRoute");
const employeeBillRoute = require("./employeeBillRoute");
const employeePositionRoute = require("./employeePositionRoute");
const employeeRoute = require("./employeeRoute");
const employeeSalaryRoute = require("./employeeSalaryRoute");
const formPositionRoute = require("./formPositionRoute");
const jobVacancyDetailRoute = require("./jobVacancyDetailRoute");
const jobVacancyRoute = require("./jobVacancyRoute");
const trainingAttendanceRoute = require("./trainingAttendanceRoute");
const trainingRoute = require("./trainingRoute");
const trainingSuggestionRoute = require("./trainingSuggestionRoute");
const faceRoute = require("./faceRoute");

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: "/applicant-academic",
  //   route: applicantAcademicRoute,
  // },
  // {
  //   path: "/applicant-appreciation",
  //   route: applicantAppreciationRoute,
  // },
  // {
  //   path: "/applicant-appreciation-attachment",
  //   route: applicantAppreciationAttachmentRoute,
  // },
  // {
  //   path: "/applicant-job",
  //   route: applicantJobRoute,
  // },
  // {
  //   path: "/applicant-skill",
  //   route: applicantSkillRoute,
  // },
  // {
  //   path: "/applicant-unformal",
  //   route: applicantUnformalRoute,
  // },
  // {
  //   path: "/application-form",
  //   route: applicationFormRoute,
  // },
  // {
  //   path: "/bill-type",
  //   route: billTypeRoute,
  // },
  // {
  //   path: "/division",
  //   route: divisionRoute,
  // },
  // {
  //   path: "/employee-account",
  //   route: employeeAccountRoute,
  // },
  // {
  //   path: "/employee-announcement",
  //   route: employeeAnnouncementRoute,
  // },
  // {
  //   path: "/employee-bill",
  //   route: employeeBillRoute,
  // },
  // {
  //   path: "/employee-position",
  //   route: employeePositionRoute,
  // },
  // {
  //   path: "/employee",
  //   route: employeeRoute,
  // },
  // {
  //   path: "/employee-salary",
  //   route: employeeSalaryRoute,
  // },
  // {
  //   path: "/form-position",
  //   route: formPositionRoute,
  // },
  // {
  //   path: "/job-vacancy-detail",
  //   route: jobVacancyDetailRoute,
  // },
  // {
  //   path: "/job-vacancy",
  //   route: jobVacancyRoute,
  // },
  // {
  //   path: "/training-attendance",
  //   route: trainingAttendanceRoute,
  // },
  // {
  //   path: "/training",
  //   route: trainingRoute,
  // },
  // {
  //   path: "/training-suggestion",
  //   route: trainingSuggestionRoute,
  // },
  {
    path: "/face",
    route: faceRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
