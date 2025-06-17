import express from 'express';

import authToken from './middlewares/auth-token-middleware.js';

import authRoutes from './domains/auth/auth-routes.js';
import transactionRoutes from './domains/transaction/transaction-routes.js';
import subscriptionRoutes from "./domains/transaction/subscription/subscription-routes.js";
import planRoutes from "./domains/plan/plan-routes.js";

import inventoryRoutes from './domains/inventory/index.js';
import productRoutes from './domains/product/index.js';

import shiftRoutes from './domains/shift/index.js';
import stockRoutes from './domains/stock/stock-routes.js';
import profileRoutes from './domains/profile/index.js';
import tableRoutes from './domains/table/table-routes.js';
import orderRoutes from './domains/order/index.js'

import dashboardRoutes from './domains/dashboard/dashboard-routes.js';

const router = express.Router();

const appsRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
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
  },
  {
    path: '/stock',
    route: stockRoutes
  },
  {
    path: '/shift',
    route: shiftRoutes
  },
  {
    path: '/table',
    route: tableRoutes
  },
  {
    path: '/order',
    route: orderRoutes
  },
  {
    path: '/dashboard',
    route: dashboardRoutes
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