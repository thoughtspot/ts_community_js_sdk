/******/ var __webpack_modules__ = ({

/***/ "./src/auth.ts":
/*!*********************!*\
  !*** ./src/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Auth: () => (/* binding */ Auth)
/* harmony export */ });
/* harmony import */ var _rest_api_v2_0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rest-api-v2.0 */ "./src/rest-api-v2.0.ts");
/**
 * This file contains functions for working with the REST API v2.0.
 */

/***************************************** Authentication Endpoints ************************************************/
class Auth {
    constructor(api) {
        this.api = api;
    }
    /**
     * Returns the session info for the currently logged in user.
     */
    async sessionUser() {
        const endpoint = `auth/session/user`;
        return this.api.restApiCallV2(endpoint, "GET");
    }
    async tokenFull(username, password, orgId = 0, validity_time_in_sec = 3600) {
        const header = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        const tokenData = {
            username: username,
            password: password,
            org_id: orgId,
            validity_time_in_sec: validity_time_in_sec,
        };
        const tokenEndpoint = (0,_rest_api_v2_0__WEBPACK_IMPORTED_MODULE_0__.getFullV2Endpoint)(this.api.tsURL, "/auth/token/full");
        console.log('calling auth/token/full');
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: header,
            credentials: "include",
            body: JSON.stringify(tokenData),
        });
        if (!response.ok) {
            throw new Error(`Error calling ${tokenEndpoint} response: ${response.status}`);
        }
        return response.json();
    }
}


/***/ }),

/***/ "./src/groups.ts":
/*!***********************!*\
  !*** ./src/groups.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupType: () => (/* binding */ GroupType),
/* harmony export */   Groups: () => (/* binding */ Groups)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");

/******************************************* Group Types **********************************************************/
var GroupType;
(function (GroupType) {
    GroupType["LOCAL_GROUP"] = "LOCAL_GROUP";
    GroupType["LDAP_GROUP"] = "LDAP_GROUP";
})(GroupType || (GroupType = {}));
/******************************************* Group Endpoints **********************************************************/
class Groups {
    constructor(api) {
        this.api = api;
    }
    /**
     * The group search endpoint searches for groups based on the search criteria.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fsearch-user-groups
     * @param searchOptions The options to search for as a JSON object.
     * @returns An object with the group search results.  See docs.
     */
    async search(searchOptions = undefined) {
        const endpoint = `groups/search`;
        const opts = searchOptions || {};
        opts["record_size"] = -1;
        return this.api.restApiCallV2(endpoint, "POST", opts);
    }
    /**
     * Creates a new group.  The name must be unique for the given org.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fcreate-user-group
     * @param group Contains the groups values to set.
     * @returns The group created details.
     */
    async create(group) {
        if (!group.type) {
            group.type = GroupType.LOCAL_GROUP;
        }
        if (!group.visibility) {
            group.visibility = _types__WEBPACK_IMPORTED_MODULE_0__.Visibility.SHAREABLE;
        }
        const endpoint = `groups/create`;
        return this.api.restApiCallV2(endpoint, "POST", group);
    }
    /**
     * Deletes the group with the given identifier (name or id).
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fdelete-group
     * @param group_identifier The name or ID for the group.
     * @returns Nothing
     */
    async delete(group_identifier) {
        const endpoint = `groups/${group_identifier}/delete`;
        return this.api.restApiCallV2(endpoint, "POST");
    }
    /**
     * Updates the group.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fupdate-user-group
     * @param group The updated group details.
     * @returns None
     */
    async update(group_identifier, group) {
        if (!group.operation) {
            group.operation = _types__WEBPACK_IMPORTED_MODULE_0__.UpdateOperation.REPLACE;
        }
        const endpoint = `groups/${group_identifier}/update`;
        return this.api.restApiCallV2(endpoint, "POST", group);
    }
}


/***/ }),

/***/ "./src/orgs.ts":
/*!*********************!*\
  !*** ./src/orgs.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrgVisibility: () => (/* binding */ OrgVisibility),
/* harmony export */   Orgs: () => (/* binding */ Orgs)
/* harmony export */ });
/******************************************* Org Types **********************************************************/
var OrgVisibility;
(function (OrgVisibility) {
    OrgVisibility["SHOW"] = "SHOW";
    OrgVisibility["HIDDEN"] = "HIDDEN";
})(OrgVisibility || (OrgVisibility = {}));
/******************************************* Org Endpoints **********************************************************/
class Orgs {
    /** Create a new org endpoint. */
    constructor(api) {
        this.api = api;
    }
    /**
     * The org search endpoint searches for users based on the search criteria.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fsearch-user-orgs
     * @param {object} searchOptions The options to search for as a JSON object.
     * @returns An object with the org search results.  See docs.
     */
    async search(searchOptions = undefined) {
        const endpoint = `orgs/search`;
        // This bit of clunky code is because the API doesn't return an empty array when there are no results, but rather returns a 400 error.
        // The challenge is that the user may have badly formatted content, so this may incorrectly work.
        let orgs;
        try {
            orgs = await this.api.restApiCallV2(endpoint, "POST", searchOptions);
        }
        catch (error) {
            console.error("Error searching for orgs: ", error);
            if (error instanceof Error) {
                if (error.message.indexOf("400") === -1) {
                    throw error;
                }
                else {
                    console.log("No orgs found.");
                    orgs = [];
                }
            }
        }
        return new Promise((resolve, reject) => {
            resolve(orgs);
        });
    }
    /**
     * Creates a new org.  The name must be unique for the given org.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fcreate-user-org
     * @param org Contains the org values to set.
     * @returns The org created details.
     */
    async create(org) {
        const endpoint = `orgs/create`;
        return this.api.restApiCallV2(endpoint, "POST", org);
    }
    /**
     * Deletes the org with the given identifier (name or id).
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fdelete-org
     * @param org_identifier Either the name or the ID of the org.
     * @returns None
     */
    async delete(org_identifier) {
        const endpoint = `orgs/${org_identifier}/delete`;
        return this.api.restApiCallV2(endpoint, "POST");
    }
    /**
     * Updates the org.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fupdate-user-org
     * @param org The updated org.
     * @returns None
     */
    async update(org_identifier, org) {
        const endpoint = `orgs/${org_identifier}/update`; // we could also use the name, which might be preferable.
        return this.api.restApiCallV2(endpoint, "POST", org);
    }
}


/***/ }),

/***/ "./src/rest-api-v2.0.ts":
/*!******************************!*\
  !*** ./src/rest-api-v2.0.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TSAPIv2: () => (/* binding */ TSAPIv2),
/* harmony export */   getFullV2Endpoint: () => (/* binding */ getFullV2Endpoint)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ "./src/auth.ts");
/* harmony import */ var _groups__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./groups */ "./src/groups.ts");
/* harmony import */ var _orgs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./orgs */ "./src/orgs.ts");
/* harmony import */ var _roles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./roles */ "./src/roles.ts");
/* harmony import */ var _system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./system */ "./src/system.ts");
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./users */ "./src/users.ts");
/**
 * This file contains the interface class for working with the REST API v2.0.
 * The individual categories, e.g. users, groups, etc. can be found in the appropriate files.
 */







/***************************************************************************************************************/
/**
 * Gets a properly formatted v2.0 endpoint.
 * @param tsURL The URL for the TS instance, including the protocol (http or https).
 * @param endpoint The v2.0 endpoint to call (without common part, e.g. metadata/search).
 * @returns The full endpoint to call.
 */
const getFullV2Endpoint = (tsURL, endpoint) => {
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
class TSAPIv2 {
    /**
     * Create a new API wrapper for making calls.
     * @param url The URL to use for calls.
     * @param token A bearer token to use for calls.
     */
    constructor(apiConfig) {
        this.tsURL = apiConfig.tsURL;
        this.bearerToken = apiConfig.bearerToken || "";
        this.username = apiConfig.username || "";
        this.password = apiConfig.password || "";
        this.orgId = apiConfig.orgId || "";
        this.checkParams(); // throws an error if there's a problem with the parameters.
        // Add the specific APIs.
        this.auth = new _auth__WEBPACK_IMPORTED_MODULE_1__.Auth(this);
        this.groups = new _groups__WEBPACK_IMPORTED_MODULE_2__.Groups(this);
        this.orgs = new _orgs__WEBPACK_IMPORTED_MODULE_3__.Orgs(this);
        this.roles = new _roles__WEBPACK_IMPORTED_MODULE_4__.Roles(this);
        this.system = new _system__WEBPACK_IMPORTED_MODULE_5__.System(this);
        this.users = new _users__WEBPACK_IMPORTED_MODULE_6__.Users(this);
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
    checkParams() {
        if (!this.tsURL) {
            throw new Error(`A TS URL is required to call the APIs.`);
        }
        if (!this.username) {
            throw new Error(`A username is required to call the APIs.`);
        }
        if (!this.bearerToken && !this.password) {
            throw new Error(`A bearer token or password is required to call the APIs.`);
        }
    }
    /**
     * Creates a new TSAPIv2 via username.  This will log in to the TS instance and get a bearer token.
     * @param tsURL The full URL for TS, including the protocol (http or https).
     * @param username The user's username.
     * @param password The user's password.
     * @param [orgId] orgId The integer ID of the org.
     */
    async login() {
        console.log(`Logging in to ${this.tsURL} with username ${this.username} and orgId ${this.orgId}`);
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
    async switchOrg(orgId) {
        // should be able to just call login again, which will get a new token with the given Id.
        this.orgId = orgId;
        await this.login();
    }
    /**
     * Waits for the token to be returned.  This is needed because the login is asynchronous, so the token might not be available right away.
     * To use, simpley call await api.waitForToken() before making any calls that need the token.
     * TODO - figure out if there's a better way to do this.
     */
    async waitForToken() {
        let maxWaits = 5; // how long we'll wait to get the token.
        let waitedFor = 0;
        while (!this.bearerToken && waitedFor < maxWaits) {
            console.log("waiting for token...");
            await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.sleep)(3); // wait a second to see if the bearer token is available.
        }
        if (!this.bearerToken) {
            throw new Error(`No bearer token available after ${maxWaits} retries.  Check that the server is accessible.`);
        }
    }
    /**
     * Gets the token.
     * @returns {string} The bearer token.
     */
    get token() {
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
    async restApiCallV2(endpoint, httpVerb, apiRequestObject = undefined) {
        let msg = `calling endpoint ${endpoint} with verb ${httpVerb} and token ${this.bearerToken.substring(0, 8)}... `;
        if (apiRequestObject) {
            msg += ` and data ${JSON.stringify(apiRequestObject)}`;
        }
        console.log(msg);
        const maxRetries = 3; // how long we'll wait to get the token.
        let retries = 0;
        while (!this.bearerToken && retries < maxRetries) {
            await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.sleep)(1); // wait a second to see if the bearer token is available.
        }
        if (!this.bearerToken) {
            throw new Error(`No bearer token available after ${maxRetries} retries.`);
        }
        const apiFullEndpoint = getFullV2Endpoint(this.tsURL, endpoint);
        // Set up the header.
        const headers = {
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
                throw new Error(`Error calling ${apiFullEndpoint} error: ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
            else {
                return response.text();
            }
        }
        catch (error) {
            console.error(`Error calling ${endpoint} response: ${error}`);
            throw error;
        }
    }
}


/***/ }),

/***/ "./src/roles.ts":
/*!**********************!*\
  !*** ./src/roles.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Roles: () => (/* binding */ Roles)
/* harmony export */ });
/******************************************* Role Types **********************************************************/
var RolePermission;
(function (RolePermission) {
    RolePermission["READ_ONLY"] = "READ_ONLY";
    RolePermission["MODIFY"] = "MODIFY";
    RolePermission["NO_ACCESS"] = "NO_ACCESS";
})(RolePermission || (RolePermission = {}));
/******************************************* Role Endpoints **********************************************************/
class Roles {
    constructor(api) {
        this.api = api;
    }
    /**
     * The role search endpoint searches for users based on the search criteria.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fsearch-roles
     * @param searchOptions The options to search for as a JSON object.
     * @returns An object with the role search results.  See docs.
     */
    async search(searchOptions = {}) {
        if (searchOptions === undefined) { // TODO: why isn't this the default?
            searchOptions = {};
        }
        console.log("searchOptions: ", searchOptions);
        const endpoint = `roles/search`;
        return this.api.restApiCallV2(endpoint, "POST", searchOptions);
    }
    /**
     * Creates a new role.  The name must be unique for the given org.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fcreate-role
     * @param role Contains the users values to set.
     * @returns The role created details.
     */
    async create(role) {
        const endpoint = `roles/create`;
        return this.api.restApiCallV2(endpoint, "POST", role);
    }
    /**
     * Deletes the role with the given identifier (name or id).
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fdelete-role
     * @param role_identifier The name or ID for the role.
     * @returns Nothing
     */
    async delete(role_identifier) {
        const endpoint = `roles/${role_identifier}/delete`;
        return this.api.restApiCallV2(endpoint, "POST");
    }
    /**
     * Updates the role.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fupdate-role
     * @param role The updated role details.
     * @returns None
     */
    async update(role_identifier, role) {
        const endpoint = `roles/${role_identifier}/update`; // we could also use the name, which might be preferable.
        return this.api.restApiCallV2(endpoint, "POST", role);
    }
}


/***/ }),

/***/ "./src/system.ts":
/*!***********************!*\
  !*** ./src/system.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   System: () => (/* binding */ System)
/* harmony export */ });
/**
 * This file contains functions for working with the REST API v2.0.
 *
 * TODO - add additional endpoints.
 */
/***************************************** Authentication Endpoints ************************************************/
class System {
    constructor(api) {
        this.api = api;
    }
    /**
     * Returns the system config.
     */
    async config() {
        const endpoint = `system/config`;
        return this.api.restApiCallV2(endpoint, "GET");
    }
    async config_overrides() {
        const endpoint = `system/config-overrides`;
        return this.api.restApiCallV2(endpoint, "GET");
    }
    /**
     * Updates the configuration.  The body is an object with key/value pairs and the keys must be valid override keys.
     */
    async config_update(config) {
        const endpoint = `system/config-update`;
        return this.api.restApiCallV2(endpoint, "POST", config);
    }
    /**
     * Returns the system info.
     */
    async system() {
        const endpoint = `system`;
        return this.api.restApiCallV2(endpoint, "GET");
    }
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALL_PRIVILEGES: () => (/* binding */ ALL_PRIVILEGES),
/* harmony export */   FavoritesMetadataTypes: () => (/* binding */ FavoritesMetadataTypes),
/* harmony export */   Privileges: () => (/* binding */ Privileges),
/* harmony export */   SortOrder: () => (/* binding */ SortOrder),
/* harmony export */   UpdateOperation: () => (/* binding */ UpdateOperation),
/* harmony export */   Visibility: () => (/* binding */ Visibility)
/* harmony export */ });
/**
 * Enum representing the privileges available in the system.
 */
var Privileges;
(function (Privileges) {
    Privileges["UNKNOWN"] = "UNKNOWN";
    Privileges["ADMINISTRATION"] = "ADMINISTRATION";
    Privileges["AUTHORING"] = "AUTHORING";
    Privileges["USERDATAUPLOADING"] = "USERDATAUPLOADING";
    Privileges["DATADOWNLOADING"] = "DATADOWNLOADING";
    Privileges["USERMANAGEMENT"] = "USERMANAGEMENT";
    Privileges["SECURITYMANAGEMENT"] = "SECURITYMANAGEMENT";
    Privileges["LOGICALMODELING"] = "LOGICALMODELING";
    Privileges["DATAMANAGEMENT"] = "DATAMANAGEMENT";
    Privileges["TAGMANAGEMENT"] = "TAGMANAGEMENT";
    Privileges["SHAREWITHALL"] = "SHAREWITHALL";
    Privileges["SYSTEMMANAGEMENT"] = "SYSTEMMANAGEMENT";
    Privileges["JOBSCHEDULING"] = "JOBSCHEDULING";
    Privileges["A3ANALYSIS"] = "A3ANALYSIS";
    Privileges["EXPERIMENTALFEATUREPRIVILEGE"] = "EXPERIMENTALFEATUREPRIVILEGE";
    Privileges["BYPASSRLS"] = "BYPASSRLS";
    Privileges["RANALYSIS"] = "RANALYSIS";
    Privileges["DISABLE_PINBOARD_CREATION"] = "DISABLE_PINBOARD_CREATION";
    Privileges["DEVELOPER"] = "DEVELOPER";
    Privileges["APPLICATION_ADMINISTRATION"] = "APPLICATION_ADMINISTRATION";
    Privileges["USER_ADMINISTRATION"] = "USER_ADMINISTRATION";
    Privileges["GROUP_ADMINISTRATION"] = "GROUP_ADMINISTRATION";
    Privileges["ROLE_ADMINISTRATION"] = "ROLE_ADMINISTRATION";
    Privileges["AUTHENTICATION_ADMINISTRATION"] = "AUTHENTICATION_ADMINISTRATION";
    Privileges["BILLING_INFO_ADMINISTRATION"] = "BILLING_INFO_ADMINISTRATION";
    Privileges["PREVIEW_THOUGHTSPOT_SAGE"] = "PREVIEW_THOUGHTSPOT_SAGE";
})(Privileges || (Privileges = {}));
/**
 * An array containing all the values of the Privileges enum.
 * */
const ALL_PRIVILEGES = Object.values(Privileges);
/**
 * Enum representing the types of user and group visibility in the system.
 */
var Visibility;
(function (Visibility) {
    Visibility["SHARABLE"] = "SHARABLE";
    Visibility["SHAREABLE"] = "SHARABLE";
    Visibility["NON_SHARABLE"] = "NON_SHARABLE";
    Visibility["NON_SHAREABLE"] = "NON_SHARABLE";
})(Visibility || (Visibility = {}));
/**
 * Enum representing the standard sort orders.
 */
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (SortOrder = {}));
/**
 * Enum representing the possible options for update operations.
 * Not all options are available for all endpoints.
 */
var UpdateOperation;
(function (UpdateOperation) {
    UpdateOperation["ADD"] = "ADD";
    UpdateOperation["REMOVE"] = "REMOVE";
    UpdateOperation["REPLACE"] = "REPLACE";
})(UpdateOperation || (UpdateOperation = {}));
// ------------------ Metadata types ------------------
var FavoritesMetadataTypes;
(function (FavoritesMetadataTypes) {
    FavoritesMetadataTypes["LIVEBOARD"] = "LIVEBOARD";
    FavoritesMetadataTypes["ANSWER"] = "ANSWER";
})(FavoritesMetadataTypes || (FavoritesMetadataTypes = {}));


/***/ }),

/***/ "./src/users.ts":
/*!**********************!*\
  !*** ./src/users.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Users: () => (/* binding */ Users)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/**
 * This file contains functions for working with the Users REST API v2.0 endpoints.
 */

/***************************************** Types ************************************************/
var AccountType;
(function (AccountType) {
    AccountType["LOCAL_USER"] = "LOCAL_USER";
    AccountType["LDAP_USER"] = "LDAP_USER";
    AccountType["SAML_USER"] = "SAML_USER";
    AccountType["OIDC_USER"] = "OIDC_USER";
    AccountType["REMOTE_USER"] = "REMOTE_USER";
})(AccountType || (AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["EXPIRED"] = "EXPIRED";
    AccountStatus["LOCKED"] = "LOCKED";
    AccountStatus["PENDING"] = "PENDING";
})(AccountStatus || (AccountStatus = {}));
/***************************************** User endpoints ************************************************/
class Users {
    constructor(api) {
        this.api = api;
    }
    /**
     * Creates a new user.  The name must be unique.
     * https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fcreate-user
     * @param user Contains the users values to set.
     * @returns The user created details.
     */
    async create(user) {
        // Add defaults if not provided.
        if (!user.account_type) {
            user.account_type = AccountType.LOCAL_USER;
        }
        if (!user.account_status) {
            user.account_status = AccountStatus.ACTIVE;
        }
        if (!user.visibility) {
            user.visibility = _types__WEBPACK_IMPORTED_MODULE_0__.Visibility.SHAREABLE;
        }
        const endpoint = `users/create`;
        return this.api.restApiCallV2(endpoint, "POST", user);
    }
    /**
     * Deletes the user with the given identifier (name or id).
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fdelete-user
     * @param user_identifier
     * @returns None
     */
    async delete(user_identifier) {
        const endpoint = `users/${user_identifier}/delete`;
        return this.api.restApiCallV2(endpoint, "POST");
    }
    /**
     * Resets the users password.  Only done by Admins since old password isn't required.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Freset-user-password
     * @param user_identifier Name or id of the user.
     * @param new_password The new password for the user.
     * @returns None
     */
    async resetPassword(user_identifier, new_password) {
        const endpoint = `users/reset-password`;
        return this.api.restApiCallV2(endpoint, "POST", {
            user_identifier: user_identifier,
            new_password: new_password,
        });
    }
    /**
     * The user search endpoint searches for users based on the search criteria.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fsearch-users
     * @param searchOptions The options to search for as a JSON object.
     * @returns An array with the user search results.  See docs.
     */
    async search(searchOptions = undefined) {
        const endpoint = `users/search`;
        return this.api.restApiCallV2(endpoint, "POST", searchOptions);
    }
    /**
     * Updates the user.  Note that passwords cannot be updated with this call.  The default is to REPLACE.
     * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fupdate-user
     * @param user The parameters to update.
     * @returns None
     */
    async update(user_identifier, user) {
        if (!user.operation) {
            user.operation = "REPLACE"; // required: REPLACE, ADD, REMOVE -- TODO - may have to support other operations.
        }
        const endpoint = `users/${user_identifier}/update`; // we could also use the name, which might be preferable.
        return this.api.restApiCallV2(endpoint, "POST", user);
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sleep: () => (/* binding */ sleep)
/* harmony export */ });
/**
 * This file contains general utility functions.
 */
/** Sleeps for the number of seconds. */
const sleep = async (sec) => {
    await new Promise((r) => setTimeout(r, sec * 1000));
};


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./src/rest-api-v2.0.ts");
/******/ var __webpack_exports__TSAPIv2 = __webpack_exports__.TSAPIv2;
/******/ var __webpack_exports__getFullV2Endpoint = __webpack_exports__.getFullV2Endpoint;
/******/ export { __webpack_exports__TSAPIv2 as TSAPIv2, __webpack_exports__getFullV2Endpoint as getFullV2Endpoint };
/******/ 

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQTJCLEVBQUUsSUFBYztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsaUZBQWlGO1FBQy9HLENBQUM7UUFDRCxNQUFNLFFBQVEsR0FBRyxTQUFTLGVBQWUsU0FBUyxDQUFDLENBQUMseURBQXlEO1FBQzdHLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBRUY7Ozs7Ozs7Ozs7Ozs7OztBQzlKRDs7R0FFRztBQUVILHdDQUF3QztBQUNqQyxNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDekMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUM7Ozs7Ozs7U0NQRjtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7U0VOQTtTQUNBO1NBQ0E7U0FDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Jlc3QtYXBpLXYyLjAvLi9zcmMvYXV0aC50cyIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wLy4vc3JjL2dyb3Vwcy50cyIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wLy4vc3JjL29yZ3MudHMiLCJ3ZWJwYWNrOi8vcmVzdC1hcGktdjIuMC8uL3NyYy9yZXN0LWFwaS12Mi4wLnRzIiwid2VicGFjazovL3Jlc3QtYXBpLXYyLjAvLi9zcmMvcm9sZXMudHMiLCJ3ZWJwYWNrOi8vcmVzdC1hcGktdjIuMC8uL3NyYy9zeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vcmVzdC1hcGktdjIuMC8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wLy4vc3JjL3VzZXJzLnRzIiwid2VicGFjazovL3Jlc3QtYXBpLXYyLjAvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcmVzdC1hcGktdjIuMC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcmVzdC1hcGktdjIuMC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Jlc3QtYXBpLXYyLjAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9yZXN0LWFwaS12Mi4wL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBmdW5jdGlvbnMgZm9yIHdvcmtpbmcgd2l0aCB0aGUgUkVTVCBBUEkgdjIuMC5cbiAqL1xuXG5pbXBvcnQge30gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgVFNBUEl2MiwgZ2V0RnVsbFYyRW5kcG9pbnQgfSBmcm9tIFwiLi9yZXN0LWFwaS12Mi4wXCI7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBUeXBlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmludGVyZmFjZSBUb2tlbiB7XG4gIHRva2VuOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBTZXNzaW9uSW5mbyB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGlzcGxheV9uYW1lOiBzdHJpbmc7XG4gIHZpc2liaWxpdHk6IHN0cmluZztcbiAgYXV0aG9yX2lkOiBzdHJpbmc7XG4gIGNhbl9jaGFuZ2VfcGFzc3dvcmQ6IGJvb2xlYW47XG4gIGNvbXBsZXRlX2RldGFpbDogYm9vbGVhbjtcbiAgY3JlYXRpb25fdGltZV9pbl9taWxsaXM6IG51bWJlcjtcbiAgY3VycmVudF9vcmc6IHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgfTtcbiAgZGVsZXRlZDogYm9vbGVhbjtcbiAgZGVwcmVjYXRlZDogYm9vbGVhbjtcbiAgYWNjb3VudF90eXBlOiBzdHJpbmc7XG4gIGFjY291bnRfc3RhdHVzOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGV4cGlyYXRpb25fdGltZV9pbl9taWxsaXM6IG51bWJlcjtcbiAgZXh0ZXJuYWw6IGJvb2xlYW47XG4gIGZhdm9yaXRlX21ldGFkYXRhOiBhbnlbXTtcbiAgZmlyc3RfbG9naW5fdGltZV9pbl9taWxsaXM6IG51bWJlcjtcbiAgZ3JvdXBfbWFzazogbnVtYmVyO1xuICBoaWRkZW46IGJvb2xlYW47XG4gIGhvbWVfbGl2ZWJvYXJkOiBudWxsO1xuICBpbmNvbXBsZXRlX2RldGFpbHM6IGFueVtdO1xuICBpc19maXJzdF9sb2dpbjogYm9vbGVhbjtcbiAgbW9kaWZpY2F0aW9uX3RpbWVfaW5fbWlsbGlzOiBudW1iZXI7XG4gIG1vZGlmaWVyX2lkOiBzdHJpbmc7XG4gIG5vdGlmeV9vbl9zaGFyZTogYm9vbGVhbjtcbiAgb25ib2FyZGluZ19leHBlcmllbmNlX2NvbXBsZXRlZDogYm9vbGVhbjtcbiAgb3Jnczoge1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9W107XG4gIG93bmVyX2lkOiBzdHJpbmc7XG4gIHBhcmVudF90eXBlOiBzdHJpbmc7XG4gIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICBzaG93X29uYm9hcmRpbmdfZXhwZXJpZW5jZTogYm9vbGVhbjtcbiAgc3VwZXJfdXNlcjogYm9vbGVhbjtcbiAgc3lzdGVtX3VzZXI6IGJvb2xlYW47XG4gIHRhZ3M6IGFueVtdO1xuICB0ZW5hbnRfaWQ6IHN0cmluZztcbiAgdXNlcl9ncm91cHM6IGFueVtdO1xuICB1c2VyX2luaGVyaXRlZF9ncm91cHM6IGFueVtdO1xuICB3ZWxjb21lX2VtYWlsX3NlbnQ6IGJvb2xlYW47XG4gIG9yZ19wcml2aWxlZ2VzOiBudWxsO1xuICBwcmVmZXJyZWRfbG9jYWxlOiBzdHJpbmc7XG4gIGV4dGVuZGVkX3Byb3BlcnRpZXM6IHtcbiAgICBkaXNwbGF5TmFtZUxhc3RVcGRhdGVkQnk6IHN0cmluZztcbiAgfTtcbiAgZXh0ZW5kZWRfcHJlZmVyZW5jZXM6IHtcbiAgICBudW1UaW1lc0Rpc3BsYXlOYW1lRGlhbG9nU2hvd246IG51bWJlcjtcbiAgICBzYXZlZEF1dGhvckZpbHRlcjogc3RyaW5nO1xuICB9O1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXV0aGVudGljYXRpb24gRW5kcG9pbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGNsYXNzIEF1dGgge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpOiBUU0FQSXYyKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzZXNzaW9uIGluZm8gZm9yIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBhc3luYyBzZXNzaW9uVXNlcigpOiBQcm9taXNlPFNlc3Npb25JbmZvPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgYXV0aC9zZXNzaW9uL3VzZXJgO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiR0VUXCIpO1xuICB9XG5cbiAgYXN5bmMgdG9rZW5GdWxsKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG9yZ0lkOiBzdHJpbmcgfCBudW1iZXIgPSAwLCB2YWxpZGl0eV90aW1lX2luX3NlYyA9IDM2MDApOiBQcm9taXNlPFRva2VuPiB7XG4gICAgY29uc3QgaGVhZGVyOiBIZWFkZXJzSW5pdCA9IHtcbiAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB9O1xuXG4gICAgY29uc3QgdG9rZW5EYXRhID0ge1xuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgb3JnX2lkOiBvcmdJZCxcbiAgICAgIHZhbGlkaXR5X3RpbWVfaW5fc2VjOiB2YWxpZGl0eV90aW1lX2luX3NlYyxcbiAgICB9O1xuXG4gICAgY29uc3QgdG9rZW5FbmRwb2ludCA9IGdldEZ1bGxWMkVuZHBvaW50KHRoaXMuYXBpLnRzVVJMLCBcIi9hdXRoL3Rva2VuL2Z1bGxcIik7XG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgYXV0aC90b2tlbi9mdWxsJyk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0b2tlbkVuZHBvaW50LCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogaGVhZGVyLFxuICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodG9rZW5EYXRhKSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVycm9yIGNhbGxpbmcgJHt0b2tlbkVuZHBvaW50fSByZXNwb25zZTogJHtyZXNwb25zZS5zdGF0dXN9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUU0FQSXYyIH0gZnJvbSBcIi4vcmVzdC1hcGktdjIuMFwiO1xuXG5pbXBvcnQgeyBJZGVudGlmaWVyLCBVcGRhdGVPcGVyYXRpb24sIFZpc2liaWxpdHkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBHcm91cCBUeXBlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZW51bSBHcm91cFR5cGUge1xuICBMT0NBTF9HUk9VUCA9IFwiTE9DQUxfR1JPVVBcIixcbiAgTERBUF9HUk9VUCA9IFwiTERBUF9HUk9VUFwiLFxufVxuXG4vLyBkZWZpbmVzIHNlYXJjaCBvcHRpb25zIGZvciBncm91cCBzZWFyY2guXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwU2VhcmNoT3B0aW9ucyB7XG4gIHJlY29yZF9vZmZzZXQ/OiBudW1iZXI7XG4gIHJlY29yZF9zaXplPzogbnVtYmVyO1xuICBkZWZhdWx0X2xpdmVib2FyZF9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgZGlzcGxheV9uYW1lPzogc3RyaW5nO1xuICBuYW1lX3BhdHRlcm4/OiBzdHJpbmc7XG4gIGdyb3VwX2lkZW50aWZpZXI/OiBzdHJpbmc7XG4gIG9yZ19pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICBwcml2aWxlZ2VzPzogc3RyaW5nW107IC8vIFRPRE8gYWRkIGVudW1lcmF0ZWQgdHlwZVxuICBzdWJfZ3JvdXBfaWRlbnRpZmllcnM/OiBzdHJpbmdbXTtcbiAgdHlwZT86IEdyb3VwVHlwZTtcbiAgdXNlcl9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICB2aXNpYmlsaXR5PzogVmlzaWJpbGl0eTtcbiAgcm9sZV9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwT3B0aW9ucyB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlfbmFtZT86IHN0cmluZztcbiAgdHlwZT86IEdyb3VwVHlwZTtcbiAgdmlzaWJpbGl0eT86IFZpc2liaWxpdHk7XG4gIGRlZmF1bHRfbGl2ZWJvYXJkX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcml2aWxlZ2VzPzogc3RyaW5nW107XG4gIHN1Yl9ncm91cF9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICB1c2VyX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gIHJvbGVfaWRlbnRpZmllcnM/OiBzdHJpbmdbXTtcbiAgb3BlcmF0aW9uPzogVXBkYXRlT3BlcmF0aW9uOyAvLyBvbmx5IHVzZWQgZm9yIHVwZGF0ZXNcbn1cblxuaW50ZXJmYWNlIEdyb3VwSW5mbyB7XG4gIGF1dGhvcl9pZDogc3RyaW5nO1xuICBjb21wbGV0ZV9kZXRhaWw6IGJvb2xlYW47XG4gIGNvbnRlbnQ6IHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG4gIH07XG4gIGNyZWF0aW9uX3RpbWVfaW5fbWlsbGlzOiBudW1iZXI7XG4gIGRlZmF1bHRfbGl2ZWJvYXJkczoge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9W107XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHZpc2liaWxpdHk6IFZpc2liaWxpdHk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEdyb3VwIEVuZHBvaW50cyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgY2xhc3MgR3JvdXBzIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGk6IFRTQVBJdjIpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBncm91cCBzZWFyY2ggZW5kcG9pbnQgc2VhcmNoZXMgZm9yIGdyb3VwcyBiYXNlZCBvbiB0aGUgc2VhcmNoIGNyaXRlcmlhLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZncm91cHMlMkZzZWFyY2gtdXNlci1ncm91cHNcbiAgICogQHBhcmFtIHNlYXJjaE9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gc2VhcmNoIGZvciBhcyBhIEpTT04gb2JqZWN0LlxuICAgKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgZ3JvdXAgc2VhcmNoIHJlc3VsdHMuICBTZWUgZG9jcy5cbiAgICovXG4gIGFzeW5jIHNlYXJjaChzZWFyY2hPcHRpb25zOiBHcm91cFNlYXJjaE9wdGlvbnMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpOiBQcm9taXNlPEdyb3VwSW5mb1tdPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgZ3JvdXBzL3NlYXJjaGA7XG4gICAgY29uc3Qgb3B0cyA9IHNlYXJjaE9wdGlvbnMgfHwge307XG5cbiAgICBvcHRzW1wicmVjb3JkX3NpemVcIl0gPSAtMTtcbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZ3JvdXAuICBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGdpdmVuIG9yZy5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGZ3JvdXBzJTJGY3JlYXRlLXVzZXItZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwIENvbnRhaW5zIHRoZSBncm91cHMgdmFsdWVzIHRvIHNldC5cbiAgICogQHJldHVybnMgVGhlIGdyb3VwIGNyZWF0ZWQgZGV0YWlscy5cbiAgICovXG4gIGFzeW5jIGNyZWF0ZShncm91cDogR3JvdXBPcHRpb25zKTogUHJvbWlzZTxHcm91cEluZm8+IHtcbiAgICBpZiAoIWdyb3VwLnR5cGUpIHtcbiAgICAgIGdyb3VwLnR5cGUgPSBHcm91cFR5cGUuTE9DQUxfR1JPVVA7XG4gICAgfVxuICAgIGlmICghZ3JvdXAudmlzaWJpbGl0eSkge1xuICAgICAgZ3JvdXAudmlzaWJpbGl0eSA9IFZpc2liaWxpdHkuU0hBUkVBQkxFO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gYGdyb3Vwcy9jcmVhdGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIiwgZ3JvdXApO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIGdyb3VwIHdpdGggdGhlIGdpdmVuIGlkZW50aWZpZXIgKG5hbWUgb3IgaWQpLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZncm91cHMlMkZkZWxldGUtZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwX2lkZW50aWZpZXIgVGhlIG5hbWUgb3IgSUQgZm9yIHRoZSBncm91cC5cbiAgICogQHJldHVybnMgTm90aGluZ1xuICAgKi9cbiAgYXN5bmMgZGVsZXRlKGdyb3VwX2lkZW50aWZpZXI6IElkZW50aWZpZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IGBncm91cHMvJHtncm91cF9pZGVudGlmaWVyfS9kZWxldGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZ3JvdXAuXG4gICAqIFNlZSBodHRwczovL2RldmVsb3BlcnMudGhvdWdodHNwb3QuY29tL2RvY3MvcmVzdFYyLXBsYXlncm91bmQ/YXBpUmVzb3VyY2VJZD1odHRwJTJGYXBpLWVuZHBvaW50cyUyRmdyb3VwcyUyRnVwZGF0ZS11c2VyLWdyb3VwXG4gICAqIEBwYXJhbSBncm91cCBUaGUgdXBkYXRlZCBncm91cCBkZXRhaWxzLlxuICAgKiBAcmV0dXJucyBOb25lXG4gICAqL1xuICBhc3luYyB1cGRhdGUoXG4gICAgZ3JvdXBfaWRlbnRpZmllcjogSWRlbnRpZmllcixcbiAgICBncm91cDogR3JvdXBPcHRpb25zXG4gICk6IFByb21pc2U8b2JqZWN0PiB7XG4gICAgaWYgKCFncm91cC5vcGVyYXRpb24pIHtcbiAgICAgIGdyb3VwLm9wZXJhdGlvbiA9IFVwZGF0ZU9wZXJhdGlvbi5SRVBMQUNFO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gYGdyb3Vwcy8ke2dyb3VwX2lkZW50aWZpZXJ9L3VwZGF0ZWA7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiUE9TVFwiLCBncm91cCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRTQVBJdjIgfSBmcm9tIFwiLi9yZXN0LWFwaS12Mi4wXCI7XG5cbmltcG9ydCB7IElkZW50aWZpZXIsIFVwZGF0ZU9wZXJhdGlvbiwgVmlzaWJpbGl0eSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIE9yZyBUeXBlcyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZW51bSBPcmdWaXNpYmlsaXR5IHtcbiAgU0hPVyA9IFwiU0hPV1wiLFxuICBISURERU4gPSBcIkhJRERFTlwiLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZ1NlYXJjaE9wdGlvbnMge1xuICBvcmdfaWRlbnRpZmllcj86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHZpc2liaWxpdHk/OiBPcmdWaXNpYmlsaXR5O1xuICBzdGF0dXM/OiBzdHJpbmc7XG4gIHVzZXJfaWRlbnRpZmllcnM/OiBJZGVudGlmaWVyW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JnT3B0aW9ucyB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHVzZXJJZGVudGlmaWVycz86IElkZW50aWZpZXJbXTsgLy8gb25seSB1c2VkIGZvciB1cGRhdGVzXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JnSW5mbyB7XG4gIGlkOiBudW1iZXI7XG4gIG5hbWU6IHN0cmluZztcbiAgc3RhdHVzOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHZpc2liaWxpdHk6IE9yZ1Zpc2liaWxpdHk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIE9yZyBFbmRwb2ludHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGNsYXNzIE9yZ3Mge1xuICAvKiogQ3JlYXRlIGEgbmV3IG9yZyBlbmRwb2ludC4gKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGk6IFRTQVBJdjIpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBvcmcgc2VhcmNoIGVuZHBvaW50IHNlYXJjaGVzIGZvciB1c2VycyBiYXNlZCBvbiB0aGUgc2VhcmNoIGNyaXRlcmlhLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZvcmdzJTJGc2VhcmNoLXVzZXItb3Jnc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2VhcmNoT3B0aW9ucyBUaGUgb3B0aW9ucyB0byBzZWFyY2ggZm9yIGFzIGEgSlNPTiBvYmplY3QuXG4gICAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIHRoZSBvcmcgc2VhcmNoIHJlc3VsdHMuICBTZWUgZG9jcy5cbiAgICovXG4gIGFzeW5jIHNlYXJjaChcbiAgICBzZWFyY2hPcHRpb25zOiBPcmdTZWFyY2hPcHRpb25zIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICk6IFByb21pc2U8T3JnSW5mb1tdPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgb3Jncy9zZWFyY2hgO1xuXG4gICAgLy8gVGhpcyBiaXQgb2YgY2x1bmt5IGNvZGUgaXMgYmVjYXVzZSB0aGUgQVBJIGRvZXNuJ3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5IHdoZW4gdGhlcmUgYXJlIG5vIHJlc3VsdHMsIGJ1dCByYXRoZXIgcmV0dXJucyBhIDQwMCBlcnJvci5cbiAgICAvLyBUaGUgY2hhbGxlbmdlIGlzIHRoYXQgdGhlIHVzZXIgbWF5IGhhdmUgYmFkbHkgZm9ybWF0dGVkIGNvbnRlbnQsIHNvIHRoaXMgbWF5IGluY29ycmVjdGx5IHdvcmsuXG4gICAgbGV0IG9yZ3M6IE9yZ0luZm9bXTtcbiAgICB0cnkge1xuICAgICAgb3JncyA9IGF3YWl0IHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiUE9TVFwiLCBzZWFyY2hPcHRpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNlYXJjaGluZyBmb3Igb3JnczogXCIsIGVycm9yKTtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvci5tZXNzYWdlLmluZGV4T2YoXCI0MDBcIikgPT09IC0xKSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJObyBvcmdzIGZvdW5kLlwiKTtcbiAgICAgICAgICBvcmdzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZShvcmdzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG9yZy4gIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIGZvciB0aGUgZ2l2ZW4gb3JnLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZvcmdzJTJGY3JlYXRlLXVzZXItb3JnXG4gICAqIEBwYXJhbSBvcmcgQ29udGFpbnMgdGhlIG9yZyB2YWx1ZXMgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgb3JnIGNyZWF0ZWQgZGV0YWlscy5cbiAgICovXG4gIGFzeW5jIGNyZWF0ZShvcmc6IE9yZ09wdGlvbnMpOiBQcm9taXNlPE9yZ0luZm8+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IGBvcmdzL2NyZWF0ZWA7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiUE9TVFwiLCBvcmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIG9yZyB3aXRoIHRoZSBnaXZlbiBpZGVudGlmaWVyIChuYW1lIG9yIGlkKS5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGb3JncyUyRmRlbGV0ZS1vcmdcbiAgICogQHBhcmFtIG9yZ19pZGVudGlmaWVyIEVpdGhlciB0aGUgbmFtZSBvciB0aGUgSUQgb2YgdGhlIG9yZy5cbiAgICogQHJldHVybnMgTm9uZVxuICAgKi9cbiAgYXN5bmMgZGVsZXRlKG9yZ19pZGVudGlmaWVyOiBJZGVudGlmaWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgb3Jncy8ke29yZ19pZGVudGlmaWVyfS9kZWxldGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgb3JnLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZvcmdzJTJGdXBkYXRlLXVzZXItb3JnXG4gICAqIEBwYXJhbSBvcmcgVGhlIHVwZGF0ZWQgb3JnLlxuICAgKiBAcmV0dXJucyBOb25lXG4gICAqL1xuICBhc3luYyB1cGRhdGUob3JnX2lkZW50aWZpZXI6IElkZW50aWZpZXIsIG9yZzogb2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgb3Jncy8ke29yZ19pZGVudGlmaWVyfS91cGRhdGVgOyAvLyB3ZSBjb3VsZCBhbHNvIHVzZSB0aGUgbmFtZSwgd2hpY2ggbWlnaHQgYmUgcHJlZmVyYWJsZS5cbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIG9yZyk7XG4gIH1cbn1cbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBpbnRlcmZhY2UgY2xhc3MgZm9yIHdvcmtpbmcgd2l0aCB0aGUgUkVTVCBBUEkgdjIuMC5cbiAqIFRoZSBpbmRpdmlkdWFsIGNhdGVnb3JpZXMsIGUuZy4gdXNlcnMsIGdyb3VwcywgZXRjLiBjYW4gYmUgZm91bmQgaW4gdGhlIGFwcHJvcHJpYXRlIGZpbGVzLlxuICovXG5cbmltcG9ydCB7IHNsZWVwIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuaW1wb3J0IHsgQXV0aCB9IGZyb20gXCIuL2F1dGhcIjtcbmltcG9ydCB7IEdyb3VwcyB9IGZyb20gXCIuL2dyb3Vwc1wiO1xuaW1wb3J0IHsgT3JncyB9IGZyb20gXCIuL29yZ3NcIjtcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSBcIi4vcm9sZXNcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbVwiO1xuaW1wb3J0IHsgVXNlcnMgfSBmcm9tIFwiLi91c2Vyc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFQSUNvbmZpZyB7XG4gIHRzVVJMOiBzdHJpbmc7XG4gIGJlYXJlclRva2VuPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIG9yZ0lkPzogc3RyaW5nIHwgbnVtYmVyO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIEdldHMgYSBwcm9wZXJseSBmb3JtYXR0ZWQgdjIuMCBlbmRwb2ludC5cbiAqIEBwYXJhbSB0c1VSTCBUaGUgVVJMIGZvciB0aGUgVFMgaW5zdGFuY2UsIGluY2x1ZGluZyB0aGUgcHJvdG9jb2wgKGh0dHAgb3IgaHR0cHMpLlxuICogQHBhcmFtIGVuZHBvaW50IFRoZSB2Mi4wIGVuZHBvaW50IHRvIGNhbGwgKHdpdGhvdXQgY29tbW9uIHBhcnQsIGUuZy4gbWV0YWRhdGEvc2VhcmNoKS5cbiAqIEByZXR1cm5zIFRoZSBmdWxsIGVuZHBvaW50IHRvIGNhbGwuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGdWxsVjJFbmRwb2ludCA9ICh0c1VSTDogc3RyaW5nLCBlbmRwb2ludDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgLy8gbWFrZSBzdXJlIHRoZSBlbmRwb2ludCBzdGFydHMgd2l0aCBhIC9cbiAgaWYgKCFlbmRwb2ludC5zdGFydHNXaXRoKFwiL1wiKSkge1xuICAgIGVuZHBvaW50ID0gXCIvXCIgKyBlbmRwb2ludDtcbiAgfVxuXG4gIHRzVVJMID0gdHNVUkwuZW5kc1dpdGgoXCIvXCIpID8gdHNVUkwuc2xpY2UoMCwgLTEpIDogdHNVUkw7IC8vIHN0cmlwIGFueSB0cmFpbGluZyAvXG5cbiAgY29uc3QgcHVibGljQXBpVXJsID0gXCIvYXBpL3Jlc3QvMi4wXCI7XG4gIHJldHVybiB0c1VSTCArIHB1YmxpY0FwaVVybCArIGVuZHBvaW50O1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnRhaW5zIGZ1bmN0aW9ucyBmb3Igd29ya2luZyB3aXRoIHRoZSBSRVNUIEFQSSB2Mi4wLlxuICovXG5leHBvcnQgY2xhc3MgVFNBUEl2MiB7XG4gIHJlYWRvbmx5IHRzVVJMOiBzdHJpbmc7IC8vIGNhbiBvbmx5IGJlIHNldCB2aWEgY29uc3RydWN0b3IuXG4gIHByb3RlY3RlZCBiZWFyZXJUb2tlbjogc3RyaW5nOyAvLyBjYW4gb25seSBiZSBzZXQgdmlhIGNvbnN0cnVjdG9yIG9yIG90aGVyIG1ldGhvZHMuXG4gIHJlYWRvbmx5IHVzZXJuYW1lOiBzdHJpbmc7IC8vIGNhbiBvbmx5IGJlIHNldCB2aWEgY29uc3RydWN0b3IuXG4gIHByb3RlY3RlZCBwYXNzd29yZDogc3RyaW5nOyAvLyBjYW4gb25seSBiZSBzZXQgdmlhIGNvbnN0cnVjdG9yLlxuICBwcm90ZWN0ZWQgb3JnSWQ6IHN0cmluZyB8IG51bWJlcjsgLy8gY2FuIG9ubHkgYmUgc2V0IHZpYSBjb25zdHJ1Y3RvciBvciBzd2l0Y2guXG5cbiAgLy8gQVBJIHNwZWNpZmljIGNsYXNzZXMgd2l0aCB0aGUgYWN0dWFsIGNhbGxzLiAgVXNlcnMgd2lsbCBtYWtlIGNhbGxzIGxpa2UgYXBpLm1ldGFkYXRhLnNlYXJjaCgpIHRvIGdldCB0aGUgbWV0YWRhdGEuXG4gIHJlYWRvbmx5IGF1dGg6IEF1dGg7XG4gIHJlYWRvbmx5IGdyb3VwczogR3JvdXBzO1xuICByZWFkb25seSBvcmdzOiBPcmdzO1xuICByZWFkb25seSByb2xlczogUm9sZXM7XG4gIHJlYWRvbmx5IHN5c3RlbTogU3lzdGVtO1xuICByZWFkb25seSB1c2VyczogVXNlcnM7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBBUEkgd3JhcHBlciBmb3IgbWFraW5nIGNhbGxzLlxuICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgdG8gdXNlIGZvciBjYWxscy5cbiAgICogQHBhcmFtIHRva2VuIEEgYmVhcmVyIHRva2VuIHRvIHVzZSBmb3IgY2FsbHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhcGlDb25maWc6IEFQSUNvbmZpZykge1xuICAgIHRoaXMudHNVUkwgPSBhcGlDb25maWcudHNVUkw7XG4gICAgdGhpcy5iZWFyZXJUb2tlbiA9IGFwaUNvbmZpZy5iZWFyZXJUb2tlbiB8fCBcIlwiO1xuICAgIHRoaXMudXNlcm5hbWUgPSBhcGlDb25maWcudXNlcm5hbWUgfHwgXCJcIjtcbiAgICB0aGlzLnBhc3N3b3JkID0gYXBpQ29uZmlnLnBhc3N3b3JkIHx8IFwiXCI7XG4gICAgdGhpcy5vcmdJZCA9IGFwaUNvbmZpZy5vcmdJZCB8fCBcIlwiO1xuXG4gICAgdGhpcy5jaGVja1BhcmFtcygpOyAvLyB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlcmUncyBhIHByb2JsZW0gd2l0aCB0aGUgcGFyYW1ldGVycy5cblxuICAgIC8vIEFkZCB0aGUgc3BlY2lmaWMgQVBJcy5cbiAgICB0aGlzLmF1dGggPSBuZXcgQXV0aCh0aGlzKTtcbiAgICB0aGlzLmdyb3VwcyA9IG5ldyBHcm91cHModGhpcyk7XG4gICAgdGhpcy5vcmdzID0gbmV3IE9yZ3ModGhpcyk7XG4gICAgdGhpcy5yb2xlcyA9IG5ldyBSb2xlcyh0aGlzKTtcbiAgICB0aGlzLnN5c3RlbSA9IG5ldyBTeXN0ZW0odGhpcyk7XG4gICAgdGhpcy51c2VycyA9IG5ldyBVc2Vycyh0aGlzKTtcblxuICAgIC8vIE5vdyBmaWd1cmUgb3V0IHRoZSBhdXRoLiAgSWYgYSBiZWFyZXIgdG9rZW4gd2FzIHByb3ZpZGVkLCB0aGVuIHVzZSBpdC4gIElmIG5vdCwgdGhlbiB1c2UgdGhlIHVzZXJuYW1lIC8gcHdkIGFuZCBsb2dpblxuICAgIC8vIFRPRE8gVGhpcyBjb3VsZCBjYXVzZSB0aW1pbmcgaXNzdWVzIGJlY2F1c2UgaXQgdGFrZXMgdGltZSB0byBsb2dpbiwgc28gdGhlIGJlYXJlciB0b2tlbiBtaWdodCBub3QgYmUgYXZhaWxhYmxlIHJpZ2h0IGF3YXkuXG4gICAgLy8gTWF5IHdhbnQgdG8gY2hlY2sgd2hlbiBtYWtpbmcgY2FsbHMgdGhhdCBpdCdzIGJlZW4gc2V0LlxuICAgIGlmICghdGhpcy5iZWFyZXJUb2tlbikge1xuICAgICAgdGhpcy5sb2dpbigpOyAvLyBub3RoaW5nIHRvIGhhbmRsZSBmb3IgdGhlIHByb21pc2UsIHNvIGp1c3QgY2FsbCBpdC5cbiAgICAgIHRoaXMud2FpdEZvclRva2VuKCk7IC8vIHdhaXQgZm9yIHRoZSB0b2tlbiB0byBiZSBhdmFpbGFibGUuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGUgcGFyYW1ldGVycyBmb3IgdmFsaWRpdHkuXG4gICAqL1xuICBwcml2YXRlIGNoZWNrUGFyYW1zKCkge1xuICAgIGlmICghdGhpcy50c1VSTCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIFRTIFVSTCBpcyByZXF1aXJlZCB0byBjYWxsIHRoZSBBUElzLmApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy51c2VybmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHVzZXJuYW1lIGlzIHJlcXVpcmVkIHRvIGNhbGwgdGhlIEFQSXMuYCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmJlYXJlclRva2VuICYmICF0aGlzLnBhc3N3b3JkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBBIGJlYXJlciB0b2tlbiBvciBwYXNzd29yZCBpcyByZXF1aXJlZCB0byBjYWxsIHRoZSBBUElzLmBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVFNBUEl2MiB2aWEgdXNlcm5hbWUuICBUaGlzIHdpbGwgbG9nIGluIHRvIHRoZSBUUyBpbnN0YW5jZSBhbmQgZ2V0IGEgYmVhcmVyIHRva2VuLlxuICAgKiBAcGFyYW0gdHNVUkwgVGhlIGZ1bGwgVVJMIGZvciBUUywgaW5jbHVkaW5nIHRoZSBwcm90b2NvbCAoaHR0cCBvciBodHRwcykuXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgdXNlcidzIHVzZXJuYW1lLlxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIFtvcmdJZF0gb3JnSWQgVGhlIGludGVnZXIgSUQgb2YgdGhlIG9yZy5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgbG9naW4oKSB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgTG9nZ2luZyBpbiB0byAke3RoaXMudHNVUkx9IHdpdGggdXNlcm5hbWUgJHt0aGlzLnVzZXJuYW1lfSBhbmQgb3JnSWQgJHt0aGlzLm9yZ0lkfWBcbiAgICApO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5hdXRoXG4gICAgICAudG9rZW5GdWxsKHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQsIHRoaXMub3JnSWQsIDM2MDApXG4gICAgICAudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgdGhpcy5iZWFyZXJUb2tlbiA9IHRva2VuLnRva2VuO1xuICAgICAgICBjb25zb2xlLmxvZygnZ290IHRva2VuOiAnLCB0aGlzLmJlYXJlclRva2VuKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGxvZ2dpbmcgaW46ICR7ZXJyb3J9YCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyB3aWxsIGF1dGhlbnRpY2F0ZSB0byBhIG5ldyBvcmcuICBXaXRoIHRva2VucyB5b3UgY2FuJ3Qgc3dpdGNoIG9yZ3MsIHNvIGl0IGFjdHVhbGx5IHJlLWF1dGhlbnRpY2F0ZXMuXG4gICAqIElmIHlvdSBjYWxsIHRoaXMgeW91IG11c3Qgd2FpdCBmb3IgY29tcGxldGlvbiBiZWZvcmUgbWFraW5nIGFkZGl0aW9uYWwgY2FsbHMgdG8gbWFrZSBzdXJlIHlvdSBoYXZlIHRoZSByaWdodCB0b2tlbi5cbiAgICogQHBhcmFtIG9yZ0lkIFRoZSBpZCB0aGUgb3JnIHRvIHN3aXRjaCB0by5cbiAgICovXG4gIGFzeW5jIHN3aXRjaE9yZyhvcmdJZDogc3RyaW5nIHwgbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8ganVzdCBjYWxsIGxvZ2luIGFnYWluLCB3aGljaCB3aWxsIGdldCBhIG5ldyB0b2tlbiB3aXRoIHRoZSBnaXZlbiBJZC5cbiAgICB0aGlzLm9yZ0lkID0gb3JnSWQ7XG4gICAgYXdhaXQgdGhpcy5sb2dpbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgdG9rZW4gdG8gYmUgcmV0dXJuZWQuICBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBsb2dpbiBpcyBhc3luY2hyb25vdXMsIHNvIHRoZSB0b2tlbiBtaWdodCBub3QgYmUgYXZhaWxhYmxlIHJpZ2h0IGF3YXkuXG4gICAqIFRvIHVzZSwgc2ltcGxleSBjYWxsIGF3YWl0IGFwaS53YWl0Rm9yVG9rZW4oKSBiZWZvcmUgbWFraW5nIGFueSBjYWxscyB0aGF0IG5lZWQgdGhlIHRva2VuLlxuICAgKiBUT0RPIC0gZmlndXJlIG91dCBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlxuICAgKi9cbiAgYXN5bmMgd2FpdEZvclRva2VuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBtYXhXYWl0cyA9IDU7IC8vIGhvdyBsb25nIHdlJ2xsIHdhaXQgdG8gZ2V0IHRoZSB0b2tlbi5cbiAgICBsZXQgd2FpdGVkRm9yID0gMDtcblxuICAgIHdoaWxlICghdGhpcy5iZWFyZXJUb2tlbiAmJiB3YWl0ZWRGb3IgPCBtYXhXYWl0cykge1xuICAgICAgY29uc29sZS5sb2coXCJ3YWl0aW5nIGZvciB0b2tlbi4uLlwiKTtcbiAgICAgIGF3YWl0IHNsZWVwKDMpOyAvLyB3YWl0IGEgc2Vjb25kIHRvIHNlZSBpZiB0aGUgYmVhcmVyIHRva2VuIGlzIGF2YWlsYWJsZS5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYmVhcmVyVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gYmVhcmVyIHRva2VuIGF2YWlsYWJsZSBhZnRlciAke21heFdhaXRzfSByZXRyaWVzLiAgQ2hlY2sgdGhhdCB0aGUgc2VydmVyIGlzIGFjY2Vzc2libGUuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRva2VuLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYmVhcmVyIHRva2VuLlxuICAgKi9cbiAgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgY29uc29sZS5sb2coXCJnZXR0aW5nIHRva2VuOiBcIiwgdGhpcy5iZWFyZXJUb2tlbik7XG4gICAgcmV0dXJuIHRoaXMuYmVhcmVyVG9rZW47XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQVBJIFdyYXBwZXIgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAvKipcbiAgICogR2VuZXJpYyBmdW5jdGlvbiB0byBtYWtlIGEgY2FsbCB0byB0aGUgVjIuMCBSRVNUIEFQSVxuICAgKiB3cmFwcGVyIGZvciBhbGwgUkVTVCBBUEkgY2FsbHMuICBTcGVjaWZpYyBjYWxscyBzaG91bGQgc2V0IHVwIHRoZSBwYXJhbWV0ZXJzIGFuZCBjYWxsIHRoaXMgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBlbmRwb2ludCBUaGUgcmVzdCBlbmRwb2ludCAoYWZ0ZXIgdGhlIDIuMC8pIHRvIGNhbGwuXG4gICAqIEBwYXJhbSBodHRwVmVyYiBUaGUgZm9ybSBvZiB0aGUgY2FsbCwgZS5nLiBHRVQsIFBPU1QsIERFTEVURSwgZXRjLlxuICAgKiBAcGFyYW0gYXBpUmVxdWVzdE9iamVjdCBUaGUgZGF0YSB0byBwYXNzIHdpdGggdGhlIHJlcXVlc3QuIExldCB1bmRlZmluZWQgZm9yIEdFVCBhbmQgSEVBRC5cbiAgICovXG4gIGFzeW5jIHJlc3RBcGlDYWxsVjIoXG4gICAgZW5kcG9pbnQ6IHN0cmluZyxcbiAgICBodHRwVmVyYjogc3RyaW5nLFxuICAgIGFwaVJlcXVlc3RPYmplY3Q6IG9iamVjdCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICApIHtcbiAgICBsZXQgbXNnID0gYGNhbGxpbmcgZW5kcG9pbnQgJHtlbmRwb2ludH0gd2l0aCB2ZXJiICR7aHR0cFZlcmJ9IGFuZCB0b2tlbiAke3RoaXMuYmVhcmVyVG9rZW4uc3Vic3RyaW5nKFxuICAgICAgMCxcbiAgICAgIDhcbiAgICApfS4uLiBgO1xuICAgIGlmIChhcGlSZXF1ZXN0T2JqZWN0KSB7XG4gICAgICBtc2cgKz0gYCBhbmQgZGF0YSAke0pTT04uc3RyaW5naWZ5KGFwaVJlcXVlc3RPYmplY3QpfWA7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKG1zZyk7XG5cbiAgICBjb25zdCBtYXhSZXRyaWVzID0gMzsgLy8gaG93IGxvbmcgd2UnbGwgd2FpdCB0byBnZXQgdGhlIHRva2VuLlxuICAgIGxldCByZXRyaWVzID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuYmVhcmVyVG9rZW4gJiYgcmV0cmllcyA8IG1heFJldHJpZXMpIHtcbiAgICAgIGF3YWl0IHNsZWVwKDEpOyAvLyB3YWl0IGEgc2Vjb25kIHRvIHNlZSBpZiB0aGUgYmVhcmVyIHRva2VuIGlzIGF2YWlsYWJsZS5cbiAgICB9XG4gICAgaWYgKCF0aGlzLmJlYXJlclRva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGJlYXJlciB0b2tlbiBhdmFpbGFibGUgYWZ0ZXIgJHttYXhSZXRyaWVzfSByZXRyaWVzLmApO1xuICAgIH1cblxuICAgIGNvbnN0IGFwaUZ1bGxFbmRwb2ludCA9IGdldEZ1bGxWMkVuZHBvaW50KHRoaXMudHNVUkwsIGVuZHBvaW50KTtcblxuICAgIC8vIFNldCB1cCB0aGUgaGVhZGVyLlxuICAgIGNvbnN0IGhlYWRlcnM6IEhlYWRlcnNJbml0ID0ge1xuICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIH07XG4gICAgaWYgKHRoaXMuYmVhcmVyVG9rZW4pIHtcbiAgICAgIGhlYWRlcnNbXCJBdXRob3JpemF0aW9uXCJdID0gYEJlYXJlciAke3RoaXMuYmVhcmVyVG9rZW59YDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlGdWxsRW5kcG9pbnQsIHtcbiAgICAgICAgbWV0aG9kOiBodHRwVmVyYi50b1VwcGVyQ2FzZSgpLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgIGJvZHk6IGFwaVJlcXVlc3RPYmplY3QgPyBKU09OLnN0cmluZ2lmeShhcGlSZXF1ZXN0T2JqZWN0KSA6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDQpIHtcbiAgICAgICAgLy8gbm8gY29udGVudCwgc28gZG9uJ3QgdHJ5IHRvIHBhcnNlIGl0LlxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uub2s7IC8vIFRPRE8gLSBpcyB0aGlzIGEgcHJvYmxlbSBzaW5jZSBpdCdzIG5vdCByZXR1cm5pbmcgYSBQcm9taXNlP1xuICAgICAgfVxuXG4gICAgICAvLyBOZWVkIHRvIGhhbmRsZSBiYWQgY2FsbHMuICBHb2luZyB0byB0aHJvdyBleGNlcHRpb25zIGZvciB0aGVzZS5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBFcnJvciBjYWxsaW5nICR7YXBpRnVsbEVuZHBvaW50fSBlcnJvcjogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XG4gICAgICBpZiAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImFwcGxpY2F0aW9uL2pzb25cIikgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBjYWxsaW5nICR7ZW5kcG9pbnR9IHJlc3BvbnNlOiAke2Vycm9yfWApO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBUU0FQSXYyIH0gZnJvbSBcIi4vcmVzdC1hcGktdjIuMFwiO1xuXG5pbXBvcnQgeyBJZGVudGlmaWVyLCBQcml2aWxlZ2VzLCBVcGRhdGVPcGVyYXRpb24sIFZpc2liaWxpdHkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSb2xlIFR5cGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmVudW0gUm9sZVBlcm1pc3Npb24ge1xuICAgIFJFQURfT05MWSA9IFwiUkVBRF9PTkxZXCIsXG4gICAgTU9ESUZZID0gXCJNT0RJRllcIixcbiAgICBOT19BQ0NFU1MgPSBcIk5PX0FDQ0VTU1wiLFxufVxuXG5pbnRlcmZhY2UgUm9sZURldGFpbHMge1xuICAgIG5hbWU6IHN0cmluZzsgIC8vIFlvdSBhbHdheXMgbmVlZCBhIG5hbWUsIGV2ZW4gd2hlbiB1cGRhdGluZy5cbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgICBwcml2aWxlZ2VzPzogUHJpdmlsZWdlc1tdO1xufVxuXG5pbnRlcmZhY2UgUm9sZVNlYXJjaE9wdGlvbnMge1xuICAgIHJvbGVfaWRlbnRpZmllcnM/OiBJZGVudGlmaWVyW107XG4gICAgb3JnX2lkZW50aWZpZXJzPzogSWRlbnRpZmllcltdO1xuICAgIGdyb3VwX2lkZW50aWZpZXJzPzogSWRlbnRpZmllcltdO1xuICAgIHByaXZpbGVnZXM/OiBQcml2aWxlZ2VzW107XG4gICAgZGVwcmVjYXRlZD86IGJvb2xlYW47XG4gICAgZXh0ZXJuYWw/OiBib29sZWFuO1xuICAgIHNoYXJlZF92aWFfY29ubmVjdGlvbj86IGJvb2xlYW47XG4gICAgcGVybWlzc2lvbnM/OiBSb2xlUGVybWlzc2lvbltdO1xufVxuXG5pbnRlcmZhY2UgU2VhcmNoUm9sZVJlc3BvbnNlIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIGdyb3Vwc19hc3NpZ25lZF9jb3VudDogbnVtYmVyIHwgbnVsbDtcbiAgICBvcmdzOiBHZW5lcmljSW5mb1tdOyAvLyBSZXBsYWNlIHdpdGggdGhlIGFjdHVhbCB0eXBlXG4gICAgZ3JvdXBzOiBHZW5lcmljSW5mb1tdOyAvLyBSZXBsYWNlIHdpdGggdGhlIGFjdHVhbCB0eXBlXG4gICAgcHJpdmlsZWdlczogUHJpdmlsZWdlc1tdOyAvLyBSZXBsYWNlIHdpdGggdGhlIGFjdHVhbCB0eXBlXG4gICAgcGVybWlzc2lvbjogc3RyaW5nO1xuICAgIGF1dGhvcl9pZDogc3RyaW5nO1xuICAgIG1vZGlmaWVyX2lkOiBzdHJpbmc7XG4gICAgY3JlYXRpb25fdGltZV9pbl9taWxsaXM6IG51bWJlcjtcbiAgICBtb2RpZmljYXRpb25fdGltZV9pbl9taWxsaXM6IG51bWJlcjtcbiAgICBkZWxldGVkOiBib29sZWFuO1xuICAgIGRlcHJlY2F0ZWQ6IGJvb2xlYW47XG4gICAgZXh0ZXJuYWw6IGJvb2xlYW47XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIHNoYXJlZF92aWFfY29ubmVjdGlvbjogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEdlbmVyaWNJbmZvIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUm9sZSBFbmRwb2ludHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGNsYXNzIFJvbGVzIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpOiBUU0FQSXYyKSB7IH1cbiAgLyoqXG4gICAqIFRoZSByb2xlIHNlYXJjaCBlbmRwb2ludCBzZWFyY2hlcyBmb3IgdXNlcnMgYmFzZWQgb24gdGhlIHNlYXJjaCBjcml0ZXJpYS5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGcm9sZXMlMkZzZWFyY2gtcm9sZXNcbiAgICogQHBhcmFtIHNlYXJjaE9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gc2VhcmNoIGZvciBhcyBhIEpTT04gb2JqZWN0LlxuICAgKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgcm9sZSBzZWFyY2ggcmVzdWx0cy4gIFNlZSBkb2NzLlxuICAgKi9cbiAgYXN5bmMgc2VhcmNoKHNlYXJjaE9wdGlvbnM6IFJvbGVTZWFyY2hPcHRpb25zIHwgdW5kZWZpbmVkID0ge30pOiBQcm9taXNlPFNlYXJjaFJvbGVSZXNwb25zZVtdPiB7XG5cbiAgICBpZiAoc2VhcmNoT3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IC8vIFRPRE86IHdoeSBpc24ndCB0aGlzIHRoZSBkZWZhdWx0P1xuICAgICAgc2VhcmNoT3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwic2VhcmNoT3B0aW9uczogXCIsIHNlYXJjaE9wdGlvbnMpO1xuXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgcm9sZXMvc2VhcmNoYDtcbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIHNlYXJjaE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcm9sZS4gIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIGZvciB0aGUgZ2l2ZW4gb3JnLlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZyb2xlcyUyRmNyZWF0ZS1yb2xlXG4gICAqIEBwYXJhbSByb2xlIENvbnRhaW5zIHRoZSB1c2VycyB2YWx1ZXMgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgcm9sZSBjcmVhdGVkIGRldGFpbHMuXG4gICAqL1xuICBhc3luYyBjcmVhdGUocm9sZTogb2JqZWN0KTogUHJvbWlzZTxTZWFyY2hSb2xlUmVzcG9uc2U+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IGByb2xlcy9jcmVhdGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIiwgcm9sZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyB0aGUgcm9sZSB3aXRoIHRoZSBnaXZlbiBpZGVudGlmaWVyIChuYW1lIG9yIGlkKS5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGcm9sZXMlMkZkZWxldGUtcm9sZVxuICAgKiBAcGFyYW0gcm9sZV9pZGVudGlmaWVyIFRoZSBuYW1lIG9yIElEIGZvciB0aGUgcm9sZS5cbiAgICogQHJldHVybnMgTm90aGluZ1xuICAgKi9cbiAgYXN5bmMgZGVsZXRlKHJvbGVfaWRlbnRpZmllcjogSWRlbnRpZmllcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gYHJvbGVzLyR7cm9sZV9pZGVudGlmaWVyfS9kZWxldGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcm9sZS5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGcm9sZXMlMkZ1cGRhdGUtcm9sZVxuICAgKiBAcGFyYW0gcm9sZSBUaGUgdXBkYXRlZCByb2xlIGRldGFpbHMuXG4gICAqIEByZXR1cm5zIE5vbmVcbiAgICovXG4gIGFzeW5jIHVwZGF0ZShyb2xlX2lkZW50aWZpZXI6IElkZW50aWZpZXIsIHJvbGU6IFJvbGVEZXRhaWxzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgcm9sZXMvJHtyb2xlX2lkZW50aWZpZXJ9L3VwZGF0ZWA7IC8vIHdlIGNvdWxkIGFsc28gdXNlIHRoZSBuYW1lLCB3aGljaCBtaWdodCBiZSBwcmVmZXJhYmxlLlxuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIiwgcm9sZSk7XG4gIH1cbn1cbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIGZ1bmN0aW9ucyBmb3Igd29ya2luZyB3aXRoIHRoZSBSRVNUIEFQSSB2Mi4wLlxuICpcbiAqIFRPRE8gLSBhZGQgYWRkaXRpb25hbCBlbmRwb2ludHMuXG4gKi9cblxuaW1wb3J0IHt9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IFRTQVBJdjIsIGdldEZ1bGxWMkVuZHBvaW50IH0gZnJvbSBcIi4vcmVzdC1hcGktdjIuMFwiO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogVHlwZXMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbnRlcmZhY2UgU3lzdGVtQ29uZmlnIHtcbiAgb25ib2FyZGluZ19jb250ZW50X3VybDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU3lzdGVtSW5mbyB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcmVsZWFzZV92ZXJzaW9uOiBzdHJpbmc7XG4gIHRpbWVfem9uZTogc3RyaW5nO1xuICBsb2NhbGU6IHN0cmluZztcbiAgZGF0ZV9mb3JtYXQ6IHN0cmluZztcbiAgYXBpX3ZlcnNpb246IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBlbnZpcm9ubWVudDogc3RyaW5nO1xuICBsaWNlbnNlOiBzdHJpbmc7XG4gIGRhdGVfdGltZV9mb3JtYXQ6IHN0cmluZztcbiAgdGltZV9mb3JtYXQ6IHN0cmluZztcbiAgc3lzdGVtX3VzZXJfaWQ6IHN0cmluZztcbiAgc3VwZXJfdXNlcl9pZDogc3RyaW5nO1xuICBoaWRkZW5fb2JqZWN0X2lkOiBzdHJpbmc7XG4gIHN5c3RlbV9ncm91cF9pZDogc3RyaW5nO1xuICB0c2FkbWluX3VzZXJfaWQ6IHN0cmluZztcbiAgYWRtaW5fZ3JvdXBfaWQ6IHN0cmluZztcbiAgYWxsX3RhYmxlc19jb25uZWN0aW9uX2lkOiBzdHJpbmc7XG4gIGFsbF91c2VyX2dyb3VwX2lkOiBzdHJpbmc7XG4gIGFjY2VwdF9sYW5ndWFnZTogc3RyaW5nO1xuICBhbGxfdXNlcl9ncm91cF9tZW1iZXJfdXNlcl9jb3VudDogbnVtYmVyO1xuICBsb2dpY2FsX21vZGVsX3ZlcnNpb246IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFN5c3RlbU92ZXJyaWRlcyB7XG4gIGNvbmZpZ19vdmVycmlkZV9pbmZvOiBvYmplY3Q7XG4gIF9fYXJnczogb2JqZWN0O1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQXV0aGVudGljYXRpb24gRW5kcG9pbnRzICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGNsYXNzIFN5c3RlbSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpOiBUU0FQSXYyKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzeXN0ZW0gY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgY29uZmlnKCk6IFByb21pc2U8U3lzdGVtQ29uZmlnPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgc3lzdGVtL2NvbmZpZ2A7XG5cbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJHRVRcIik7XG4gIH1cblxuICBhc3luYyBjb25maWdfb3ZlcnJpZGVzKCk6IFByb21pc2U8U3lzdGVtT3ZlcnJpZGVzPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgc3lzdGVtL2NvbmZpZy1vdmVycmlkZXNgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIkdFVFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjb25maWd1cmF0aW9uLiAgVGhlIGJvZHkgaXMgYW4gb2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzIGFuZCB0aGUga2V5cyBtdXN0IGJlIHZhbGlkIG92ZXJyaWRlIGtleXMuXG4gICAqL1xuICBhc3luYyBjb25maWdfdXBkYXRlKGNvbmZpZzogb2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgc3lzdGVtL2NvbmZpZy11cGRhdGVgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIiwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzeXN0ZW0gaW5mby5cbiAgICovXG4gIGFzeW5jIHN5c3RlbSgpOiBQcm9taXNlPFN5c3RlbUluZm8+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IGBzeXN0ZW1gO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiR0VUXCIpO1xuICB9XG5cbn1cbiIsIi8qKlxuICogUmVwcmVzZW50cyBhIGN1c3RvbSB0eXBlIGZvciBhbiBpZGVudGlmaWVyLlxuICovXG5leHBvcnQgdHlwZSBJZGVudGlmaWVyID0gc3RyaW5nO1xuXG4vKipcbiAqIEVudW0gcmVwcmVzZW50aW5nIHRoZSBwcml2aWxlZ2VzIGF2YWlsYWJsZSBpbiB0aGUgc3lzdGVtLlxuICovXG5leHBvcnQgZW51bSBQcml2aWxlZ2VzIHtcbiAgVU5LTk9XTiA9IFwiVU5LTk9XTlwiLFxuICBBRE1JTklTVFJBVElPTiA9IFwiQURNSU5JU1RSQVRJT05cIixcbiAgQVVUSE9SSU5HID0gXCJBVVRIT1JJTkdcIixcbiAgVVNFUkRBVEFVUExPQURJTkcgPSBcIlVTRVJEQVRBVVBMT0FESU5HXCIsXG4gIERBVEFET1dOTE9BRElORyA9IFwiREFUQURPV05MT0FESU5HXCIsXG4gIFVTRVJNQU5BR0VNRU5UID0gXCJVU0VSTUFOQUdFTUVOVFwiLFxuICBTRUNVUklUWU1BTkFHRU1FTlQgPSBcIlNFQ1VSSVRZTUFOQUdFTUVOVFwiLFxuICBMT0dJQ0FMTU9ERUxJTkcgPSBcIkxPR0lDQUxNT0RFTElOR1wiLFxuICBEQVRBTUFOQUdFTUVOVCA9IFwiREFUQU1BTkFHRU1FTlRcIixcbiAgVEFHTUFOQUdFTUVOVCA9IFwiVEFHTUFOQUdFTUVOVFwiLFxuICBTSEFSRVdJVEhBTEwgPSBcIlNIQVJFV0lUSEFMTFwiLFxuICBTWVNURU1NQU5BR0VNRU5UID0gXCJTWVNURU1NQU5BR0VNRU5UXCIsXG4gIEpPQlNDSEVEVUxJTkcgPSBcIkpPQlNDSEVEVUxJTkdcIixcbiAgQTNBTkFMWVNJUyA9IFwiQTNBTkFMWVNJU1wiLFxuICBFWFBFUklNRU5UQUxGRUFUVVJFUFJJVklMRUdFID0gXCJFWFBFUklNRU5UQUxGRUFUVVJFUFJJVklMRUdFXCIsXG4gIEJZUEFTU1JMUyA9IFwiQllQQVNTUkxTXCIsXG4gIFJBTkFMWVNJUyA9IFwiUkFOQUxZU0lTXCIsXG4gIERJU0FCTEVfUElOQk9BUkRfQ1JFQVRJT04gPSBcIkRJU0FCTEVfUElOQk9BUkRfQ1JFQVRJT05cIixcbiAgREVWRUxPUEVSID0gXCJERVZFTE9QRVJcIixcbiAgQVBQTElDQVRJT05fQURNSU5JU1RSQVRJT04gPSBcIkFQUExJQ0FUSU9OX0FETUlOSVNUUkFUSU9OXCIsXG4gIFVTRVJfQURNSU5JU1RSQVRJT04gPSBcIlVTRVJfQURNSU5JU1RSQVRJT05cIixcbiAgR1JPVVBfQURNSU5JU1RSQVRJT04gPSBcIkdST1VQX0FETUlOSVNUUkFUSU9OXCIsXG4gIFJPTEVfQURNSU5JU1RSQVRJT04gPSBcIlJPTEVfQURNSU5JU1RSQVRJT05cIixcbiAgQVVUSEVOVElDQVRJT05fQURNSU5JU1RSQVRJT04gPSBcIkFVVEhFTlRJQ0FUSU9OX0FETUlOSVNUUkFUSU9OXCIsXG4gIEJJTExJTkdfSU5GT19BRE1JTklTVFJBVElPTiA9IFwiQklMTElOR19JTkZPX0FETUlOSVNUUkFUSU9OXCIsXG4gIFBSRVZJRVdfVEhPVUdIVFNQT1RfU0FHRSA9IFwiUFJFVklFV19USE9VR0hUU1BPVF9TQUdFXCIsXG59XG5cbi8qKlxuICogQW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIHZhbHVlcyBvZiB0aGUgUHJpdmlsZWdlcyBlbnVtLlxuICogKi9cbmV4cG9ydCBjb25zdCBBTExfUFJJVklMRUdFUzogc3RyaW5nW10gPSBPYmplY3QudmFsdWVzKFByaXZpbGVnZXMpO1xuXG4vKipcbiAqIEVudW0gcmVwcmVzZW50aW5nIHRoZSB0eXBlcyBvZiB1c2VyIGFuZCBncm91cCB2aXNpYmlsaXR5IGluIHRoZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBlbnVtIFZpc2liaWxpdHkge1xuICBTSEFSQUJMRSA9IFwiU0hBUkFCTEVcIixcbiAgU0hBUkVBQkxFID0gXCJTSEFSQUJMRVwiLFxuICBOT05fU0hBUkFCTEUgPSBcIk5PTl9TSEFSQUJMRVwiLFxuICBOT05fU0hBUkVBQkxFID0gXCJOT05fU0hBUkFCTEVcIixcbn1cblxuLyoqXG4gKiBFbnVtIHJlcHJlc2VudGluZyB0aGUgc3RhbmRhcmQgc29ydCBvcmRlcnMuXG4gKi9cbmV4cG9ydCBlbnVtIFNvcnRPcmRlciB7IFxuICAgIEFTQyA9IFwiQVNDXCIsXG4gICAgREVTQyA9IFwiREVTQ1wiLFxufVxuXG4vKipcbiAqIEVudW0gcmVwcmVzZW50aW5nIHRoZSBwb3NzaWJsZSBvcHRpb25zIGZvciB1cGRhdGUgb3BlcmF0aW9ucy4gIFxuICogTm90IGFsbCBvcHRpb25zIGFyZSBhdmFpbGFibGUgZm9yIGFsbCBlbmRwb2ludHMuXG4gKi9cbmV4cG9ydCBlbnVtIFVwZGF0ZU9wZXJhdGlvbiB7XG4gICAgQUREID0gXCJBRERcIixcbiAgICBSRU1PVkUgPSBcIlJFTU9WRVwiLFxuICAgIFJFUExBQ0UgPSBcIlJFUExBQ0VcIixcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tIE1ldGFkYXRhIHR5cGVzIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZW51bSBGYXZvcml0ZXNNZXRhZGF0YVR5cGVzIHtcbiAgICBMSVZFQk9BUkQgPSBcIkxJVkVCT0FSRFwiLFxuICAgIEFOU1dFUiA9IFwiQU5TV0VSXCIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0YWRhdGFTZWFyY2hPcHRpb25zIHtcbiAgICBkZXBlbmRlbnRfb2JqZWN0X3ZlcnNpb24/OiBzdHJpbmc7XG4gICAgaW5jbHVkZV9hdXRvX2NyZWF0ZWRfb2JqZWN0cz86IGJvb2xlYW47XG4gICAgaW5jbHVkZV9kZXBlbmRlbnRfb2JqZWN0cz86IGJvb2xlYW47XG4gICAgaW5jbHVkZV9kZXRhaWxzPzogYm9vbGVhbjtcbiAgICBpbmNsdWRlX2hlYWRlcnM/OiBib29sZWFuO1xuICAgIGluY2x1ZGVfaGlkZGVuX29iamVjdHM/OiBib29sZWFuO1xuICAgIGluY2x1ZGVfaW5jb21wbGV0ZV9vYmplY3RzPzogYm9vbGVhbjtcbiAgICBpbmNsdWRlX3Zpc3VhbGl6YXRpb25faGVhZGVycz86IGJvb2xlYW47XG4gICAgcmVjb3JkX29mZnNldD86IG51bWJlcjtcbiAgICByZWNvcmRfc2l6ZT86IG51bWJlcjtcbiAgICBpbmNsdWRlX3N0YXRzPzogYm9vbGVhbjtcbiAgICBtZXRhZGF0YT86IE1ldGFkYXRhW107XG4gICAgcGVybWlzc2lvbnM/OiBQZXJtaXNzaW9uW107XG4gICAgY3JlYXRlZF9ieV91c2VyX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gICAgZXhjbHVkZV9vYmplY3RzPzogRXhjbHVkZU9iamVjdFtdO1xuICAgIGZhdm9yaXRlX29iamVjdF9vcHRpb25zPzogRmF2b3JpdGVPYmplY3RPcHRpb25zO1xuICAgIGluY2x1ZGVfd29ya3NoZWV0X3NlYXJjaF9hc3Npc3RfZGF0YT86IGJvb2xlYW47XG4gICAgbW9kaWZpZWRfYnlfdXNlcl9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICAgIHNvcnRfb3B0aW9ucz86IFNvcnRPcHRpb25zO1xuICAgIHRhZ19pZGVudGlmaWVycz86IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgTWV0YWRhdGEge1xuICAgIGlkZW50aWZpZXI6IHN0cmluZztcbiAgICBuYW1lX3BhdHRlcm46IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBQZXJtaXNzaW9uIHtcbiAgICBwcmluY2lwYWw6IHtcbiAgICAgICAgaWRlbnRpZmllcjogc3RyaW5nO1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgfTtcbiAgICBzaGFyZV9tb2RlOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBFeGNsdWRlT2JqZWN0IHtcbiAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRmF2b3JpdGVPYmplY3RPcHRpb25zIHtcbiAgICBpbmNsdWRlPzogYm9vbGVhbjtcbiAgICB1c2VyX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBTb3J0T3B0aW9ucyB7XG4gICAgLy8gRGVmaW5lIHlvdXIgc29ydCBvcHRpb25zIHByb3BlcnRpZXMgaGVyZVxufVxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgZnVuY3Rpb25zIGZvciB3b3JraW5nIHdpdGggdGhlIFVzZXJzIFJFU1QgQVBJIHYyLjAgZW5kcG9pbnRzLlxuICovXG5cbmltcG9ydCB7IFRTQVBJdjIgfSBmcm9tIFwiLi9yZXN0LWFwaS12Mi4wXCI7XG5cbmltcG9ydCB7XG4gIFByaXZpbGVnZXMsXG4gIFZpc2liaWxpdHksXG4gIEZhdm9yaXRlc01ldGFkYXRhVHlwZXMsXG4gIFNvcnRPcmRlcixcbiAgSWRlbnRpZmllcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFR5cGVzICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZW51bSBBY2NvdW50VHlwZSB7XG4gIExPQ0FMX1VTRVIgPSBcIkxPQ0FMX1VTRVJcIixcbiAgTERBUF9VU0VSID0gXCJMREFQX1VTRVJcIixcbiAgU0FNTF9VU0VSID0gXCJTQU1MX1VTRVJcIixcbiAgT0lEQ19VU0VSID0gXCJPSURDX1VTRVJcIixcbiAgUkVNT1RFX1VTRVIgPSBcIlJFTU9URV9VU0VSXCIsXG59XG5cbmVudW0gQWNjb3VudFN0YXR1cyB7XG4gIEFDVElWRSA9IFwiQUNUSVZFXCIsXG4gIElOQUNUSVZFID0gXCJJTkFDVElWRVwiLFxuICBFWFBJUkVEID0gXCJFWFBJUkVEXCIsXG4gIExPQ0tFRCA9IFwiTE9DS0VEXCIsXG4gIFBFTkRJTkcgPSBcIlBFTkRJTkdcIixcbn1cblxuaW50ZXJmYWNlIFVzZXJTZWFyY2hPcHRpb25zIHtcbiAgcmVjb3JkX29mZnNldD86IG51bWJlcjtcbiAgcmVjb3JkX3NpemU/OiBudW1iZXI7XG4gIGluY2x1ZGVfZmF2b3JpdGVfbWV0YWRhdGE/OiBib29sZWFuO1xuICB1c2VyX2lkZW50aWZpZXI/OiBzdHJpbmc7XG4gIGRpc3BsYXlfbmFtZT86IHN0cmluZztcbiAgbmFtZV9wYXR0ZXJuPzogc3RyaW5nO1xuICB2aXNpYmlsaXR5PzogVmlzaWJpbGl0eTtcbiAgZW1haWw/OiBzdHJpbmc7XG4gIGdyb3VwX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gIHByaXZpbGVnZXM/OiBQcml2aWxlZ2VzW107XG4gIGFjY291bnRfdHlwZT86IEFjY291bnRUeXBlO1xuICBhY2NvdW50X3N0YXR1cz86IHN0cmluZztcbiAgbm90aWZ5X29uX3NoYXJlPzogYm9vbGVhbjtcbiAgc2hvd19vbmJvYXJkaW5nX2V4cGVyaWVuY2U/OiBib29sZWFuO1xuICBvbmJvYXJkaW5nX2V4cGVyaWVuY2VfY29tcGxldGVkPzogYm9vbGVhbjtcbiAgb3JnX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gIGhvbWVfbGl2ZWJvYXJkX2lkZW50aWZpZXI/OiBzdHJpbmc7XG4gIGZhdm9yaXRlX21ldGFkYXRhPzogeyBpZGVudGlmaWVyOiBzdHJpbmc7IHR5cGU6IEZhdm9yaXRlc01ldGFkYXRhVHlwZXMgfVtdO1xuICBzb3J0X29wdGlvbnM/OiB7IGZpZWxkX25hbWU6IHN0cmluZzsgb3JkZXI6IFNvcnRPcmRlciB9O1xuICByb2xlX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG59XG5cbi8vIFVzaW5nIGZvciBtdWx0aXBsZSB0aGluZ3MsIHNvIGFsbCBwcm9wZXJ0aWVzIG1heSBvciBtYXkgbm90IGJlIHVzZWQuXG5pbnRlcmZhY2UgVXNlckluZm8ge1xuICBvcGVyYXRpb24/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlfbmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7ICAvLyBub3QgYWxsb3dlZCBmb3IgdXBkYXRlcy5cbiAgdmlzaWJpbGl0eT86IFZpc2liaWxpdHk7XG4gIGVtYWlsPzogc3RyaW5nO1xuICBhY2NvdW50X3N0YXR1cz86IEFjY291bnRTdGF0dXM7XG4gIG5vdGlmeV9vbl9zaGFyZT86IGJvb2xlYW47XG4gIHNob3dfb25ib2FyZGluZ19leHBlcmllbmNlPzogYm9vbGVhbjtcbiAgb25ib2FyZGluZ19leHBlcmllbmNlX2NvbXBsZXRlZD86IGJvb2xlYW47XG4gIGFjY291bnRfdHlwZT86IEFjY291bnRUeXBlO1xuICBncm91cF9pZGVudGlmaWVycz86IHN0cmluZ1tdO1xuICBob21lX2xpdmVib2FyZF9pZGVudGlmaWVyPzogc3RyaW5nO1xuICBmYXZvcml0ZV9tZXRhZGF0YT86IHsgaWRlbnRpZmllcjogc3RyaW5nOyB0eXBlOiBGYXZvcml0ZXNNZXRhZGF0YVR5cGVzIH1bXTtcbiAgb3JnX2lkZW50aWZpZXJzPzogc3RyaW5nW107XG4gIHByZWZlcnJlZF9sb2NhbGU/OiBzdHJpbmc7XG4gIGV4dGVuZGVkX3Byb3BlcnRpZXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICBleHRlbmRlZF9wcmVmZXJlbmNlcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBVc2VyIGVuZHBvaW50cyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBjbGFzcyBVc2VycyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpOiBUU0FQSXYyKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHVzZXIuICBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZS5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLnRob3VnaHRzcG90LmNvbS9kb2NzL3Jlc3RWMi1wbGF5Z3JvdW5kP2FwaVJlc291cmNlSWQ9aHR0cCUyRmFwaS1lbmRwb2ludHMlMkZ1c2VycyUyRmNyZWF0ZS11c2VyXG4gICAqIEBwYXJhbSB1c2VyIENvbnRhaW5zIHRoZSB1c2VycyB2YWx1ZXMgdG8gc2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdXNlciBjcmVhdGVkIGRldGFpbHMuXG4gICAqL1xuICBhc3luYyBjcmVhdGUodXNlcjogVXNlckluZm8pOiBQcm9taXNlPFVzZXJJbmZvPiB7XG4gICAgLy8gQWRkIGRlZmF1bHRzIGlmIG5vdCBwcm92aWRlZC5cbiAgICBpZiAoIXVzZXIuYWNjb3VudF90eXBlKSB7XG4gICAgICB1c2VyLmFjY291bnRfdHlwZSA9IEFjY291bnRUeXBlLkxPQ0FMX1VTRVI7XG4gICAgfVxuICAgIGlmICghdXNlci5hY2NvdW50X3N0YXR1cykge1xuICAgICAgdXNlci5hY2NvdW50X3N0YXR1cyA9IEFjY291bnRTdGF0dXMuQUNUSVZFO1xuICAgIH1cbiAgICBpZiAoIXVzZXIudmlzaWJpbGl0eSkge1xuICAgICAgdXNlci52aXNpYmlsaXR5ID0gVmlzaWJpbGl0eS5TSEFSRUFCTEU7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgdXNlcnMvY3JlYXRlYDtcbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIHVzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaWRlbnRpZmllciAobmFtZSBvciBpZCkuXG4gICAqIFNlZSBodHRwczovL2RldmVsb3BlcnMudGhvdWdodHNwb3QuY29tL2RvY3MvcmVzdFYyLXBsYXlncm91bmQ/YXBpUmVzb3VyY2VJZD1odHRwJTJGYXBpLWVuZHBvaW50cyUyRnVzZXJzJTJGZGVsZXRlLXVzZXJcbiAgICogQHBhcmFtIHVzZXJfaWRlbnRpZmllclxuICAgKiBAcmV0dXJucyBOb25lXG4gICAqL1xuICBhc3luYyBkZWxldGUodXNlcl9pZGVudGlmaWVyOiBJZGVudGlmaWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgdXNlcnMvJHt1c2VyX2lkZW50aWZpZXJ9L2RlbGV0ZWA7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJlc3RBcGlDYWxsVjIoZW5kcG9pbnQsIFwiUE9TVFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHVzZXJzIHBhc3N3b3JkLiAgT25seSBkb25lIGJ5IEFkbWlucyBzaW5jZSBvbGQgcGFzc3dvcmQgaXNuJ3QgcmVxdWlyZWQuXG4gICAqIFNlZSBodHRwczovL2RldmVsb3BlcnMudGhvdWdodHNwb3QuY29tL2RvY3MvcmVzdFYyLXBsYXlncm91bmQ/YXBpUmVzb3VyY2VJZD1odHRwJTJGYXBpLWVuZHBvaW50cyUyRnVzZXJzJTJGcmVzZXQtdXNlci1wYXNzd29yZFxuICAgKiBAcGFyYW0gdXNlcl9pZGVudGlmaWVyIE5hbWUgb3IgaWQgb2YgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSBuZXdfcGFzc3dvcmQgVGhlIG5ldyBwYXNzd29yZCBmb3IgdGhlIHVzZXIuXG4gICAqIEByZXR1cm5zIE5vbmVcbiAgICovXG4gIGFzeW5jIHJlc2V0UGFzc3dvcmQoXG4gICAgdXNlcl9pZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgbmV3X3Bhc3N3b3JkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgdXNlcnMvcmVzZXQtcGFzc3dvcmRgO1xuICAgIHJldHVybiB0aGlzLmFwaS5yZXN0QXBpQ2FsbFYyKGVuZHBvaW50LCBcIlBPU1RcIiwge1xuICAgICAgdXNlcl9pZGVudGlmaWVyOiB1c2VyX2lkZW50aWZpZXIsXG4gICAgICBuZXdfcGFzc3dvcmQ6IG5ld19wYXNzd29yZCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdXNlciBzZWFyY2ggZW5kcG9pbnQgc2VhcmNoZXMgZm9yIHVzZXJzIGJhc2VkIG9uIHRoZSBzZWFyY2ggY3JpdGVyaWEuXG4gICAqIFNlZSBodHRwczovL2RldmVsb3BlcnMudGhvdWdodHNwb3QuY29tL2RvY3MvcmVzdFYyLXBsYXlncm91bmQ/YXBpUmVzb3VyY2VJZD1odHRwJTJGYXBpLWVuZHBvaW50cyUyRnVzZXJzJTJGc2VhcmNoLXVzZXJzXG4gICAqIEBwYXJhbSBzZWFyY2hPcHRpb25zIFRoZSBvcHRpb25zIHRvIHNlYXJjaCBmb3IgYXMgYSBKU09OIG9iamVjdC5cbiAgICogQHJldHVybnMgQW4gYXJyYXkgd2l0aCB0aGUgdXNlciBzZWFyY2ggcmVzdWx0cy4gIFNlZSBkb2NzLlxuICAgKi9cbiAgYXN5bmMgc2VhcmNoKHNlYXJjaE9wdGlvbnM6IFVzZXJTZWFyY2hPcHRpb25zIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKTogUHJvbWlzZTxVc2VySW5mb1tdPiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBgdXNlcnMvc2VhcmNoYDtcbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIHNlYXJjaE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHVzZXIuICBOb3RlIHRoYXQgcGFzc3dvcmRzIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGggdGhpcyBjYWxsLiAgVGhlIGRlZmF1bHQgaXMgdG8gUkVQTEFDRS5cbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy50aG91Z2h0c3BvdC5jb20vZG9jcy9yZXN0VjItcGxheWdyb3VuZD9hcGlSZXNvdXJjZUlkPWh0dHAlMkZhcGktZW5kcG9pbnRzJTJGdXNlcnMlMkZ1cGRhdGUtdXNlclxuICAgKiBAcGFyYW0gdXNlciBUaGUgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIE5vbmVcbiAgICovXG4gIGFzeW5jIHVwZGF0ZSh1c2VyX2lkZW50aWZpZXI6IElkZW50aWZpZXIsIHVzZXI6IFVzZXJJbmZvKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF1c2VyLm9wZXJhdGlvbikge1xuICAgICAgdXNlci5vcGVyYXRpb24gPSBcIlJFUExBQ0VcIjsgLy8gcmVxdWlyZWQ6IFJFUExBQ0UsIEFERCwgUkVNT1ZFIC0tIFRPRE8gLSBtYXkgaGF2ZSB0byBzdXBwb3J0IG90aGVyIG9wZXJhdGlvbnMuXG4gICAgfVxuICAgIGNvbnN0IGVuZHBvaW50ID0gYHVzZXJzLyR7dXNlcl9pZGVudGlmaWVyfS91cGRhdGVgOyAvLyB3ZSBjb3VsZCBhbHNvIHVzZSB0aGUgbmFtZSwgd2hpY2ggbWlnaHQgYmUgcHJlZmVyYWJsZS5cbiAgICByZXR1cm4gdGhpcy5hcGkucmVzdEFwaUNhbGxWMihlbmRwb2ludCwgXCJQT1NUXCIsIHVzZXIpO1xuICB9XG5cbn1cbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIGdlbmVyYWwgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKi9cblxuLyoqIFNsZWVwcyBmb3IgdGhlIG51bWJlciBvZiBzZWNvbmRzLiAqL1xuZXhwb3J0IGNvbnN0IHNsZWVwID0gYXN5bmMgKHNlYzogbnVtYmVyKSA9PiB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHNlYyAqIDEwMDApKTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3Jlc3QtYXBpLXYyLjAudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=