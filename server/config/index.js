const validations = require('../../src/shared/model-validations');

module.exports = {

  // DB
  dbUri: 'mongodb://localhost/delist',

  // jsonwebtoken secret
  jwtSecret: '!!secret phrase!!',

  // Model validations
  validations // :validations
};
