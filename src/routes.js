import express from 'express';

import authToken from './middlewares/auth-token-middleware.js';

import authRoutes from './domains/auth/auth-routes.js';
import stockRoutes from './domains/stock/stock-routes.js';
import productRoutes from './domains/product/product-routes.js';
import transactionRoutes from './domains/transaction/transaction-routes.js';
import employeeRoutes from './domains/employee/employee-routes.js';
import shiftRoutes from './domains/shift/shift-routes.js';
import categoryRoutes from './domains/category/category-routes.js';
import subscriptionRoutes from "./domains/transaction/subscription/subscription-routes.js";
import planRoutes from "./domains/plan/plan-routes.js";

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

const appsRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/stock',
    route: stockRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/transaction',
    route: transactionRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRoutes,
  }
  {
    path: '/employee',
    route: employeeRoutes,
  },
  {
    path: '/shift',
    route: shiftRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  }
];

appsRoutes.forEach(({ path, route }) => {
  router.use(`/v1/${path}`, route);
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