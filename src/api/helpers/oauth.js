const crypto = require('crypto');

const Gateway = require('../helpers/gateway');
const Client = require('../models/client');
const AccessToken = require('../models/access_token');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function saveToken (model) {
  return AccessToken
    .find({
      client_id: model.client_id
    })
    .then(function(accessToken){
      if(accessToken) {
        return AccessToken.destroy(accessToken.id);
      }
      return Promise.resolve();
    })
    .then(function(){
      const tokenValue = generateToken();

      model.token = tokenValue;

      return AccessToken.create(model);
    })
    .then(function(){
      return Promise.resolve({
        value: model.token,
        expiration: 60000
      });
    });
};

function validateClient(request, client) {
  if (!client ||
      client.client_id !== request.client_id ||
      client.client_secret !== request.client_secret) {
    throw new Error('Unknown client');
  }
}

function clientCredentialsGrant(data) {
  let userClient;

	return Client
    .find({
      client_id: data.client_id
    })
    .then(function(client){
  		validateClient(data, client);
      userClient = client;

      return Gateway.getUser({ id: userClient.user_id });
    })
    .then(function(user){
      if (!user.role === 'admin') {
        throw new Error('Insufficient permissions');
      }

  		const model = {
  			user_id: user.id,
  			client_id: userClient.id
  		};

  		return saveToken(model);
  	});
}

function passwordGrant(data) {
  let userClient;

	return Client
    .find({
      client_id: data.client_id,
      client_secret: data.client_secret
    })
    .then(function(client){
  		validateClient(data, client);
      userClient = client;

      return Gateway.validateCredentials({
        email: data.credentials.email,
        password: data.credentials.password
      });
    })
    .then(function(user){
      if (!user) {
        throw new Error('User does not exists');
      }

  		const model = {
  			user_id: user.id,
  			client_id: userClient.id
  		};

  		return saveToken(model);
  	});
}

module.exports = {
  clientCredentialsGrant,
  passwordGrant
}
