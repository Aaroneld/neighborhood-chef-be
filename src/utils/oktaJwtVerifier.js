const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `https://${process.env.OKTA_BASE_URL}/oauth2/default`,
  assertClaims: {
    aud: 'api://default',
  },
});

module.exports = oktaJwtVerifier;
