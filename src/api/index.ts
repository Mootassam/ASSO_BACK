import express from 'express';
import cors from 'cors';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { databaseMiddleware } from '../middlewares/databaseMiddleware';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { createRateLimiter } from './apiRateLimiter';
import { languageMiddleware } from '../middlewares/languageMiddleware';
import authSocial from './auth/authSocial';
import setupSwaggerUI from './apiDocumentation';

const app = express();

// Enables CORS
app.use(cors({ origin: true }));

// Initializes and adds the database middleware.
app.use(databaseMiddleware);

// Sets the current language of the request
app.use(languageMiddleware);

// Configures the authentication middleware
// to set the currentUser to the requests
app.use(authMiddleware);

// Setup the Documentation
setupSwaggerUI(app);

// Default rate limiter
const defaultRateLimiter = createRateLimiter({
  max: 500,
  windowMs: 15 * 60 * 1000,
  message: 'errors.429',
});
app.use(defaultRateLimiter);

// Enables Helmet, a set of tools to
// increase security.
app.use(helmet());

// Parses the body of POST/PUT request
// to JSON
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      const url = (<any>req).originalUrl;
      if (url.startsWith('/api/plan/stripe/webhook')) {
        // Stripe Webhook needs the body raw in order
        // to validate the request
        (<any>req).rawBody = buf.toString();
      }
    },
  }),
);

// Configure the Entity routes
const routes = express.Router();

// Enable Passport for Social Sign-in
authSocial(app, routes);

require('./auditLog').default(routes);
require('./auth').default(routes);
require('./plan').default(routes);
require('./tenant').default(routes);
require('./file').default(routes);
require('./user').default(routes);
require('./settings').default(routes);
require('./election').default(routes);
require('./association').default(routes);
require('./newsCategory').default(routes);
require('./newsTag').default(routes);
require('./news').default(routes);
require('./partner').default(routes);
require('./group').default(routes);
require('./formule').default(routes);
require('./membership').default(routes);
require('./campaign').default(routes);
require('./objectif').default(routes);
require('./entree').default(routes);
require('./depense').default(routes);
require('./charge').default(routes);
require('./category').default(routes);
require('./subcategories').default(routes);
require('./chieldCategories').default(routes);
require('./taxes').default(routes);
require('./brands').default(routes);
require('./edit').default(routes);
require('./campaignItems').default(routes);
require('./gallery').default(routes);
require('./product').default(routes);
require('./shippingservice').default(routes);
require('./coupons').default(routes);
require('./transaction').default(routes);
require('./trackOrder').default(routes);
require('./order').default(routes);
require('./state').default(routes);
require('./attributeOptions').default(routes);
require('./cart').default(routes);
require('./paymentsettings').default(routes);
require('./review').default(routes);
require('./attributes').default(routes);
// Loads the Tenant if the :tenantId param is passed
routes.param('tenantId', tenantMiddleware);

// Add the routes to the /api endpoint
app.use('/api', routes);

export default app;
