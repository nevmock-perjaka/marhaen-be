import express from 'express';

import authToken from './middlewares/auth-token-middleware.js';

import authRoutes from './domains/auth/auth-routes.js';

const router = express.Router();

const RoutesV1 = [
  {
    path: '/auth',
    route: authRoutes.v1,
  }
];

const RoutesV2 = [
  {
    path: '/auth',
    route: authRoutes.v2
  }
]

RoutesV1.forEach((route) => {
  router.use(`/v1/${route.path}`, route.route);
});

RoutesV2.forEach((route) => {
  router.use(`/v2/${route.path}`, route.route);
});

// --------Secured API---------
// appsRoutes.forEach(({ path, route }) => {
//   const securedRouter = express.Router();
//   securedRouter.use(authToken);
//   securedRouter.use(route);
//   router.use(`/app${path}`, securedRouter);
// });

// --------Testing API---------
appsRoutes.forEach(({ path, route }) => {
  router.use(`/app${path}`, route);
});

export default router;