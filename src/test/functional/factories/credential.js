class CredentialFactory {

  createCredential(grant_type, client_id, email, password) {
    return {
      grant_type,
      client_id,
      client_secret: '1',
      email,
      password
    };
  }
}

module.exports = new CredentialFactory();
