# Github OAuth flow Firebase function (Cloud Functions)

This is a Firebase Cloud Function for the Github OAuth web application flow - for enabling your users to authorize your Github OAuth App.

If your goal is to allow your users to access their Github profile information from inside your app, then this could work for you. The end result is a Github access token relevant to that user, which can be used to make API calls such as fetching that users private repos.

This is not to be confused with the standard Firebase Github auth, which is for frontend apps using the Firebase SDK.

## Requirements

- Firebase project with a billing account attached and the 'Blaze' plan activated.
- Node.js 14 (Supported by Firebase).
- Github OAuth app

## Firebase project setup

After cloning the repo, in the door directory run:

```sh
firebase init functions
```

Answer:

- Use Typescript
- Use ESLint (Y)
- Overwrite package.json (N)
- Overwrite eslint.js (N)
- Overwrite tsconfig.json (N)
- Overwrite index.ts (N)
- Overwrite .gitignore (N)

## Github OAuth app + Secrets

First, [create your OAuth app at Github](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).

Set your Github OAuth app Client ID and Client Secret using [Firebase Environment configuration](https://firebase.google.com/docs/functions/config-env), e.g.

```sh
firebase functions:config:set github.client_id="1234"
```

```sh
firebase functions:config:set github.client_secret="1234"
```

To use your secrets in local development (Firebase emulator), you must run:

```sh
firebase functions:config:get > .runtimeconfig.json
```

## Set up and local development

```sh
cd functions/src
npm run build
```

To test locally, from the `src` directory run:

```sh
firebase emulators:start
```

The terminal output from `firebase emulators:start` should provide you with your localhost function endpoints, which will look like this:

`http://localhost:5001/[YOUR_PROJECT_ID]/us-central1/authorization`

Visit the authorization endpoint to kick off the flow.

The end goal is to be redirected back to your app's domain with the Github `access_token` (what you'll use to make your API calls - the goal of this whole process) as a query string variable that you can save to your database, local storage, or whatever you like for future Github API calls. That will look like

`https://yourapp.com/?access_token=gibberish`

## Deployment

```sh
firebase deploy --only functions
```
