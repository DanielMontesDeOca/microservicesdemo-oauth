const factory = require('../factories/user');

module.exports = {
  validUser: () => factory.createUser('1', 'admin', '123456')
};
