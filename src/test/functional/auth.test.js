const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const Gateway = require('./helpers/gateway');
const validate = require('./helpers/validate');
const GatewayInstance = require('../../api/helpers/gateway');

const fixtures = require('./fixtures/credential');
const userFixtures = require('./fixtures/user');

const errorSchema = require('./schemas/error');
const userSchema = require('./schemas/user');
const tokenSchema = require('./schemas/token');

const tokenValidation = validate(tokenSchema);
const userValidation = validate(userSchema)

chai.should();
chai.use(chaiAsPromised);

describe('Auth controller', function() {

  const fullUser = userFixtures.validUser();

  const GatewayGetUser = (shouldPass) => {
    sandbox.stub(GatewayInstance, 'getUser', (req) => {
      if (!shouldPass) {
        return Promise.reject({message: 'Error getting user'});
      }

      if (req.id === '1') {
        return Promise.resolve(fullUser);
      }
      return Promise.resolve({});
    });
  }

  const GatewayValidateCredentials = (shouldPass) => {
    sandbox.stub(GatewayInstance, 'validateCredentials', (req) => {
      if (!shouldPass) {
        return Promise.reject({message: 'Error validating user'});
      }

      if (req.email === fullUser.email && req.password === fullUser.password) {
        return Promise.resolve(fullUser);
      }

      return Promise.reject({message: 'Invalid credentials'});
    });
  };

  afterEach(function() {
    return sandbox.restore();
  });

  describe('getToken', function() {

    it('should return error if client_id does not exists', function() {
      const credential = fixtures.invalidCredential();

      GatewayValidateCredentials(true);
      GatewayGetUser(true);

      return Gateway.getToken(credential)
        .should.be.rejected
        .then(validate(errorSchema('Unknown client')));
    });

    it('should return error if client_id does not exists', function() {
      const credential = fixtures.invalidCredential();

      GatewayValidateCredentials(true);
      GatewayGetUser(true);

      return Gateway.getToken(credential)
        .should.be.rejected
        .then(validate(errorSchema('Unknown client')));
    });

    it('should return error if getUser gateway function throw a reject', function() {
      const credential = fixtures.validCredential();

      GatewayValidateCredentials(true);
      GatewayGetUser(false);

      return Gateway.getToken(credential)
      .should.be.rejected
      .then(validate(errorSchema('Error getting user')));
    });

    it('should return token successfully', function() {
      const credential = fixtures.validCredential();

      GatewayValidateCredentials(true);
      GatewayGetUser(true);

      return Gateway.getToken(credential)
      .should.be.fulfilled
      .then(tokenValidation);
    });

    it('should return error if login has bad values', function() {
      const credential = fixtures.validLogin();

      GatewayValidateCredentials(true);
      GatewayGetUser(true);

      credential.password = 'wrong';

      return Gateway.getToken(credential)
      .should.be.rejected
      .then(validate(errorSchema('Invalid credentials')));
    });

    it('should return error if validateCredentials gateway function throw a reject', function() {
      const credential = fixtures.validLogin();

      GatewayValidateCredentials(false);
      GatewayGetUser(true);

      return Gateway.getToken(credential)
      .should.be.rejected
      .then(validate(errorSchema('Error validating user')));
    });

    it('should return token successfully with valid login', function() {
      const credential = fixtures.validLogin();

      GatewayValidateCredentials(true);
      GatewayGetUser(true);

      return Gateway.getToken(credential)
      .should.be.fulfilled
      .then(tokenValidation);
    });
  });

  describe('validateToken', function() {
    let token;

    before(function() {
      const credential = fixtures.validLogin();
      GatewayValidateCredentials(true);

      return Gateway.getToken(credential)
      .then((data) => {
        token = data;
      });
    });

    it('should return error if token is invalid', function() {
      const credential = fixtures.invalidCredential();

      GatewayGetUser(true);

      return Gateway.validateToken({value: 'ASDASDASASD'})
        .should.be.rejected
        .then(validate(errorSchema('Invalid token')));
    });

    it('should return error if getUser gateway function throw a reject', function() {

      GatewayGetUser(false);

      return Gateway.validateToken(token)
      .should.be.rejected
      .then(validate(errorSchema('Error getting user')));
    });

    it('should return token successfully', function() {

      GatewayGetUser(true);

      return Gateway.validateToken(token)
      .should.be.fulfilled
      .then(userValidation);
    });
  });
});
