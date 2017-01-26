const oauthHelper = require('../helpers/oauth');
const passport = require('../auth/passport');

function getToken({ request }, callback) {

  const grant = request.grant_type === 'client_credentials' ?
                    oauthHelper.clientCredentialsGrant(request) :
                    oauthHelper.passwordGrant(request);

  return grant
  .then(token => callback(null, token))
  .catch(callback);
}

function validateToken({ request }, callback) {
  return passport.checkToken(request.value)
  .then(user => callback(null, user))
  .catch(callback);
}

module.exports = {
  getToken,
  validateToken
};
