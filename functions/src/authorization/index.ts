import * as functions from 'firebase-functions';
const baseUrl = 'https://github.com';
const authorizePath = '/login/oauth/authorize';
const clientId = functions.config().github.client_id;
const scope = 'user:email,read:org';
const allowSignup = 'false';

export const authorization = functions.https.onRequest((request, response) => {
  const authorizationUrl = `${baseUrl}${authorizePath}?client_id=${clientId}&scope=${scope}&allow_signup=${allowSignup}`;

  response.redirect(authorizationUrl);
});
