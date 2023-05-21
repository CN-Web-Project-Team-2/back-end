const express = require('express');
// const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const testRoute = require('./test.route');

const config = require('../../configs/config');
const questionRoute = require('./question.route');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/questions',
    route: questionRoute,
  },
  {
    path: '/tests',
    route: testRoute,
  },
  
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
