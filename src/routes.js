import express from 'express';

import authToken from './middlewares/auth-token-middleware.js';

import authRoutes from './domains/auth/auth-routes.js';
import transactionRoutes from './domains/transaction/transaction-routes.js';
import subscriptionRoutes from "./domains/transaction/subscription/subscription-routes.js";
import planRoutes from "./domains/plan/plan-routes.js";

import inventoryRoutes from './domains/inventory/index.js';
import productRoutes from './domains/product/index.js';

const router = express.Router();

const appsRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/plan',
    route: planRoutes
  },
  {
    path: '/transaction',
    route: transactionRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRoutes,
  },
  {
    path: '/inventory',
    route: inventoryRoutes
  },
  {
    path: '/product',
    route: productRoutes
  }
];

appsRoutes.forEach(({ path, route }) => {
  router.use(`/v1${path}`, route);
});

// RoutesV2.forEach(({ path, route }) => {
//   router.use(`/v2/${path}`, route);
// });

// --------Secured API---------
// appsRoutes.forEach(({ path, route }) => {
//   const securedRouter = express.Router();
//   securedRouter.use(authToken);
//   securedRouter.use(route);
//   router.use(`/app${path}`, securedRouter);
// });

// --------Testing API---------
// appsRoutes.forEach(({ path, route }) => {
//   router.use(`/app${path}`, route);
// });

export default router;