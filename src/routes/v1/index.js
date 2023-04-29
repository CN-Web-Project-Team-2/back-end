const express = require('express');
// const authRoute = require('./auth.route');
const userRoute = require('./user.route');

const config = require('../../configs/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
