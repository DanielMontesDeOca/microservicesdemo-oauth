const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const controller = require('../../../api/controllers/token');
const oauthHelper = require('../../../api/helpers/oauth');
const passportHelper = require('../../../api/auth/passport');
const helperFixtures = require('../fixtures/Token');

chai.should();
chai.use(chaiAsPromised);

const oauthClientCredentialsGrant = (shouldPass, token) => {
  sandbox.stub(oauthHelper, 'clientCredentialsGrant', () => {
    return shouldPass ? Promise.resolve(token) : Promise.reject('Error');
  });
};

const oauthPasswordGrant = (shouldPass, token) => {
  sandbox.stub(oauthHelper, 'passwordGrant', () => {
    return shouldPass ? Promise.resolve(token) : Promise.reject('Error');
  });
};

const passportCheckToken = (shouldPass) => {
  sandbox.stub(passportHelper, 'checkToken', () => {
    return shouldPass ? Promise.resolve() : Promise.reject('Error');
  });
}

describe('Token controller', () => {

  afterEach(() => {
    return sandbox.restore();
  });

  describe('getToken', () => {
    const fixtures = helperFixtures.getToken;
    const token = fixtures.token;

    it('should return error if clientCredentialsGrant method throw a reject', (done) => {

      const req = fixtures.req;
      oauthClientCredentialsGrant(false, token);
      oauthPasswordGrant(true, token);

      controller.getToken(req, (err, data) => {

        oauthHelper.clientCredentialsGrant.calledOnce.should.be.true;
        oauthHelper.clientCredentialsGrant.calledWith(req.request).should.be.true;
        oauthHelper.passwordGrant.calledOnce.should.be.false;

        done();
      });
    });

    it('should return a successfull response', (done) => {

      const req = fixtures.req;
      oauthClientCredentialsGrant(true, token);
      oauthPasswordGrant(true, token);

      controller.getToken(req, (err, data) => {

        oauthHelper.clientCredentialsGrant.calledOnce.should.be.true;
        oauthHelper.clientCredentialsGrant.calledWith(req.request).should.be.true;
        oauthHelper.passwordGrant.calledOnce.should.be.false;

        done();
      });
    });

    it('should return error if oauthPasswordGrant method throw a reject', (done) => {

      const req = fixtures.reqWithoutCredential;
      oauthClientCredentialsGrant(true, token);
      oauthPasswordGrant(false, token);

      controller.getToken(req, (err, data) => {

        oauthHelper.passwordGrant.calledOnce.should.be.true;
        oauthHelper.passwordGrant.calledWith(req.request).should.be.true;
        oauthHelper.clientCredentialsGrant.calledOnce.should.be.false;

        done();
      });
    });

    it('should return a successfull response', (done) => {

      const req = fixtures.reqWithoutCredential;
      oauthClientCredentialsGrant(true, token);
      oauthPasswordGrant(true, token);

      controller.getToken(req, (err, data) => {

        oauthHelper.passwordGrant.calledOnce.should.be.true;
        oauthHelper.passwordGrant.calledWith(req.request).should.be.true;
        oauthHelper.clientCredentialsGrant.calledOnce.should.be.false;

        done();
      });
    });
  });

  describe('validateToken', () => {
    const fixtures = helperFixtures.validateToken;
    const token = fixtures.req.request.value;

    it('should return error if checkToken passport method throw a reject', (done) => {

      const req = fixtures.req;
      passportCheckToken(false);

      controller.validateToken(req, (err, data) => {

        passportHelper.checkToken.calledOnce.should.be.true;
        passportHelper.checkToken.calledWith(token).should.be.true;

        done();
      });
    });

    it('should return a successfull response', (done) => {

      const req = fixtures.req;
      passportCheckToken(true);

      controller.validateToken(req, (err, data) => {

        passportHelper.checkToken.calledOnce.should.be.true;
        passportHelper.checkToken.calledWith(token).should.be.true;

        done();
      });
    });
  });
});
