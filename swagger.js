const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger-config');

// Configure swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './controllers/*.js',
  ], // you can add JSDoc comments in these files later
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};

