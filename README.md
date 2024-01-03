# REST API V2.0

The rest-api-v2.0 library is a thin wrapper around
the [ThoughtSpot REST API v2.0](https://developers.thoughtspot.com/docs/rest-api-v2) endpoints. It was developed to make
it easier to use the APIs and adds a few enhancements for authentication and API consistency. The APIs are written in
typescript and then built to javascript using webpack.

Not all API sections are currently covered. Additional APIs are expected to be added over time. See the `/src` folder
for the APIs that are supported based on the name.  For example, `users.ts` supports the user API calls.

## Building locally

To build locally do the following steps:

1. `git clone https://github.com/thoughtspot/ts_community_js_sdk.git`
2. `npm install`
3. `npm run build`
4. Create a `/test/config.ts` based on the `/test/config.ts.template` with your settings.
5. `npm run test`

## Folder structure

* / - contains configuration files
* /dist - contains the ES6 compatible javascript file.
* /src - contains the typesscript files. Each api area is in its own file.
* /test - contains Mocha/Cocoa test scripts for testing the API calls.

## API Usage

The following code examples are all in javascript and assume you have added the rest-api-v2.0.js file to your project.

### Creating an API instance

First, you need to import and create an API instance that will be used for all API calls:

```

// Import the library
import { TSAPIv2 } from 'rest-api-v2.0.js';

// Create a config with the URL, user and password for logging in and optionally an org ID.
export const config = {
  tsURL: "https://xxx.thoughtspot.cloud",
  username: "user@domain.com",
  password: "password",
  orgId: "0",
};

// Create a new API for the  config.
export const api = new TSAPIv2({ ...config });
```

### Waiting for the API to log in

The approach above uses the login API, which is asynchronous. Therefore, it's possible that the login has not completed.
To overcome this issue and possible race conditions, there is a call `api.waitForToken();` that waits for a token to be
generated. Alternatively, you can pass the token, such as you might do when embedding and using trusted authentication.

### Using the api instance to make calls.

After creating the API instance you can then make calls using the different APIs. The APIs are organized by grouping.
For example: to use the `users/search` API you would call `api.users.search()`. The parameters are the same that you
would send to the API directly. Note that all calls are asynchronous.

The following shows how to find the user details for an individual user:

```
    api.users.search({ user_identifier: "some-user" }).then((users) => {
      console.log(users);
    });
  });
```
