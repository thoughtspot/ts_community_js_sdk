/**
 * This file contains the interface class for working with the REST API v2.0.
 * The individual categories, e.g. users, groups, etc. can be found in the appropriate files.
 */

import { sleep } from "./utils";

import { Auth } from "./auth";
import { Groups } from "./groups";
import { Orgs } from "./orgs";
import { Roles } from "./roles";
import { System } from "./system";
import { Users } from "./users";

export interface APIConfig {
  tsURL: string;
  bearerToken?: string;
  username?: string;
  password?: string;
  orgId?: string | number;
}

/***************************************************************************************************************/

/**
 * Gets a properly formatted v2.0 endpoint.
 * @param tsURL The URL for the TS instance, including the protocol (http or https).
 * @param endpoint The v2.0 endpoint to call (without common part, e.g. metadata/search).
 * @returns The full endpoint to call.
 */
export const getFullV2Endpoint = (tsURL: string, endpoint: string): string => {
  // make sure the endpoint starts with a /
  if (!endpoint.startsWith("/")) {
    endpoint = "/" + endpoint;
  }

  tsURL = tsURL.endsWith("/") ? tsURL.slice(0, -1) : tsURL; // strip any trailing /

  const publicApiUrl = "/api/rest/2.0";
  return tsURL + publicApiUrl + endpoint;
};

/***************************************************************************************************************/

/**
 * This class contains functions for working with the REST API v2.0.
 */
export class TSAPIv2 {
  readonly tsURL: string; // can only be set via constructor.
  protected bearerToken: string; // can only be set via constructor or other methods.
  readonly username: string; // can only be set via constructor.
  protected password: string; // can only be set via constructor.
  protected orgId: string | number; // can only be set via constructor or switch.

  // API specific classes with the actual calls.  Users will make calls like api.metadata.search() to get the metadata.
  readonly auth: Auth;
  readonly groups: Groups;
  readonly orgs: Orgs;
  readonly roles: Roles;
  readonly system: System;
  readonly users: Users;

  /**
   * Create a new API wrapper for making calls.
   * @param url The URL to use for calls.
   * @param token A bearer token to use for calls.
   */
  constructor(apiConfig: APIConfig) {
    this.tsURL = apiConfig.tsURL;
    this.bearerToken = apiConfig.bearerToken || "";
    this.username = apiConfig.username || "";
    this.password = apiConfig.password || "";
    this.orgId = apiConfig.orgId || "";

    this.checkParams(); // throws an error if there's a problem with the parameters.

    // Add the specific APIs.
    this.auth = new Auth(this);
    this.groups = new Groups(this);
    this.orgs = new Orgs(this);
    this.roles = new Roles(this);
    this.system = new System(this);
    this.users = new Users(this);

    // Now figure out the auth.  If a bearer token was provided, then use it.  If not, then use the username / pwd and login
    // TODO This could cause timing issues because it takes time to login, so the bearer token might not be available right away.
    // May want to check when making calls that it's been set.
    if (!this.bearerToken) {
      this.login(); // nothing to handle for the promise, so just call it.
      this.waitForToken(); // wait for the token to be available.
    }
  }

  /**
   * Checks the parameters for validity.
   */
  private checkParams() {
    if (!this.tsURL) {
      throw new Error(`A TS URL is required to call the APIs.`);
    }

    if (!this.username) {
      throw new Error(`A username is required to call the APIs.`);
    }

    if (!this.bearerToken && !this.password) {
      throw new Error(
        `A bearer token or password is required to call the APIs.`
      );
    }
  }

  /**
   * Creates a new TSAPIv2 via username.  This will log in to the TS instance and get a bearer token.
   * @param tsURL The full URL for TS, including the protocol (http or https).
   * @param username The user's username.
   * @param password The user's password.
   * @param [orgId] orgId The integer ID of the org.
   */
  private async login() {
    console.log(
      `Logging in to ${this.tsURL} with username ${this.username} and orgId ${this.orgId}`
    );
    const token = this.auth
      .tokenFull(this.username, this.password, this.orgId, 3600)
      .then((token) => {
        this.bearerToken = token.token;
        console.log('got token: ', this.bearerToken);
      })
      .catch((error) => {
        console.error(`Error logging in: ${error}`);
        throw error;
      });
  }

  /**
   * This will authenticate to a new org.  With tokens you can't switch orgs, so it actually re-authenticates.
   * If you call this you must wait for completion before making additional calls to make sure you have the right token.
   * @param orgId The id the org to switch to.
   */
  async switchOrg(orgId: string | number): Promise<void> {
    // should be able to just call login again, which will get a new token with the given Id.
    this.orgId = orgId;
    await this.login();
  }

  /**
   * Waits for the token to be returned.  This is needed because the login is asynchronous, so the token might not be available right away.
   * To use, simpley call await api.waitForToken() before making any calls that need the token.
   * TODO - figure out if there's a better way to do this.
   */
  async waitForToken(): Promise<void> {
    let maxWaits = 5; // how long we'll wait to get the token.
    let waitedFor = 0;

    while (!this.bearerToken && waitedFor < maxWaits) {
      console.log("waiting for token...");
      await sleep(3); // wait a second to see if the bearer token is available.
    }

    if (!this.bearerToken) {
      throw new Error(`No bearer token available after ${maxWaits} retries.  Check that the server is accessible.`);
    }
  }

  /**
   * Gets the token.
   * @returns {string} The bearer token.
   */
  get token(): string {
    console.log("getting token: ", this.bearerToken);
    return this.bearerToken;
  }

  /***************************************** API Wrapper **********************************************************/

  /**
   * Generic function to make a call to the V2.0 REST API
   * wrapper for all REST API calls.  Specific calls should set up the parameters and call this function.
   * @param endpoint The rest endpoint (after the 2.0/) to call.
   * @param httpVerb The form of the call, e.g. GET, POST, DELETE, etc.
   * @param apiRequestObject The data to pass with the request. Let undefined for GET and HEAD.
   */
  async restApiCallV2(
    endpoint: string,
    httpVerb: string,
    apiRequestObject: object | undefined = undefined
  ) {
    let msg = `calling endpoint ${endpoint} with verb ${httpVerb} and token ${this.bearerToken.substring(
      0,
      8
    )}... `;
    if (apiRequestObject) {
      msg += ` and data ${JSON.stringify(apiRequestObject)}`;
    }
    console.log(msg);

    const maxRetries = 3; // how long we'll wait to get the token.
    let retries = 0;
    while (!this.bearerToken && retries < maxRetries) {
      await sleep(1); // wait a second to see if the bearer token is available.
    }
    if (!this.bearerToken) {
      throw new Error(`No bearer token available after ${maxRetries} retries.`);
    }

    const apiFullEndpoint = getFullV2Endpoint(this.tsURL, endpoint);

    // Set up the header.
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }

    try {
      const response = await fetch(apiFullEndpoint, {
        method: httpVerb.toUpperCase(),
        headers: headers,
        credentials: "include",
        body: apiRequestObject ? JSON.stringify(apiRequestObject) : undefined,
      });

      if (response.status === 204) {
        // no content, so don't try to parse it.
        return response.ok; // TODO - is this a problem since it's not returning a Promise?
      }

      // Need to handle bad calls.  Going to throw exceptions for these.
      if (!response.ok) {
        throw new Error(
          `Error calling ${apiFullEndpoint} error: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      console.error(`Error calling ${endpoint} response: ${error}`);
      throw error;
    }
  }
}
