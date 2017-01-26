const factory = require('../factories/credential');

module.exports = {
  userId: null,
  invalidCredential: () => factory.createCredential('client_credentials', '2','invalid@email.com', '5846816'),
  validCredential: () => factory.createCredential('client_credentials', '1','admin@email.com', '123456'),
  validLogin: () => factory.createCredential('password', '1','admin@email.com', '123456')
};
