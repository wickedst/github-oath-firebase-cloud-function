import * as functions from 'firebase-functions';
import https = require('https');
import { URL } from 'url';

const appUrl = 'https://yourapp.com';

const exchangeCodeForToken = async (code: any) => {
  const api = new URL('/login/oauth/access_token', 'https://github.com');
  api.searchParams.set('client_id', functions.config().github.client_id);
  api.searchParams.set('client_secret', functions.config().github.client_secret);
  api.searchParams.set('code', code);

  return asyncHttpsPostRequest(api);
};

const asyncHttpsPostRequest = async (url: URL): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    https
      .request(
        {
          method: 'POST',
          host: url.host,
          path: url.pathname + url.search,
          headers: {
            Accept: 'application/json'
          }
        },
        (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              reject(data);
            }
          });
        }
      )
      .on('error', reject)
      .end();
  });
};

export const callback = functions.https.onRequest(async (request, response) => {
  const { query } = request;
  const { code } = query;

  if (!code) {
    functions.logger.error('did not get expected query string named [code]');
  }

  functions.logger.info('code to exchange: ', code);

  let tokenResponse: Record<string, unknown>;
  try {
    tokenResponse = await exchangeCodeForToken(code);
  } catch {
    functions.logger.error('Failed to exchange code for access_token');
    return;
  }

  const redirectUrl = `${appUrl}?access_token=${tokenResponse.access_token}`;
  response.redirect(redirectUrl);
});
