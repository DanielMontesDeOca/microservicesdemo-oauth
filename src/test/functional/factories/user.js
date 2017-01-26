class UserFactory {

  createUser(id, name, password, role = 'user') {
    return {
      id: id,
      email: name + '@email.com',
      name: name,
      password: password,
      role: role
    };
  }
}

module.exports = new UserFactory();
