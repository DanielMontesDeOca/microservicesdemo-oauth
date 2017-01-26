const _ = require('lodash');
const Gateway = require('../helpers/gateway');
const Client = require('../models/client');
const AccessToken = require('../models/access_token');

function tokenValid(token) {
  return Math.round((Date.now() - token.created) / 1000) < 60000;
}

function checkToken(accessToken) {
  return AccessToken
    .find({
      token: accessToken
    })
    .then(function(token) {
      if (!token) {
        throw new Error('Invalid token');
      }

      if (!tokenValid(token)) {
        return AccessToken.destroy(token.id)
          .then(function() {
            throw new Error('Invalid token');
          });
      }

      return Promise.all([
        Gateway.getUser({ id: token.user_id }),
        Client.find({client_id: token.client_id})
      ]);
    })
    .then(function(results) {
      if (results) {
        let user = results[0];
        const client = results[1];

        if (!user || !client) {
          throw new Error('Unknown client');
        }

        user = _.omit(user, 'password');
        return Promise.resolve(user);
      }

      throw new Error('Invalid token');
    });
};

module.exports = {
  checkToken
}
