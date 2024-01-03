/**
 * This file contains functions for working with the Users REST API v2.0 endpoints.
 */

import { TSAPIv2 } from "./rest-api-v2.0";

import {
  Privileges,
  Visibility,
  FavoritesMetadataTypes,
  SortOrder,
  Identifier,
} from "./types";

/***************************************** Types ************************************************/

enum AccountType {
  LOCAL_USER = "LOCAL_USER",
  LDAP_USER = "LDAP_USER",
  SAML_USER = "SAML_USER",
  OIDC_USER = "OIDC_USER",
  REMOTE_USER = "REMOTE_USER",
}

enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
  LOCKED = "LOCKED",
  PENDING = "PENDING",
}

interface UserSearchOptions {
  record_offset?: number;
  record_size?: number;
  include_favorite_metadata?: boolean;
  user_identifier?: string;
  display_name?: string;
  name_pattern?: string;
  visibility?: Visibility;
  email?: string;
  group_identifiers?: string[];
  privileges?: Privileges[];
  account_type?: AccountType;
  account_status?: string;
  notify_on_share?: boolean;
  show_onboarding_experience?: boolean;
  onboarding_experience_completed?: boolean;
  org_identifiers?: string[];
  home_liveboard_identifier?: string;
  favorite_metadata?: { identifier: string; type: FavoritesMetadataTypes }[];
  sort_options?: { field_name: string; order: SortOrder };
  role_identifiers?: string[];
}

// Using for multiple things, so all properties may or may not be used.
interface UserInfo {
  operation?: string;
  name?: string;
  display_name?: string;
  password?: string;  // not allowed for updates.
  visibility?: Visibility;
  email?: string;
  account_status?: AccountStatus;
  notify_on_share?: boolean;
  show_onboarding_experience?: boolean;
  onboarding_experience_completed?: boolean;
  account_type?: AccountType;
  group_identifiers?: string[];
  home_liveboard_identifier?: string;
  favorite_metadata?: { identifier: string; type: FavoritesMetadataTypes }[];
  org_identifiers?: string[];
  preferred_locale?: string;
  extended_properties?: { [key: string]: string };
  extended_preferences?: { [key: string]: string };
}

/***************************************** User endpoints ************************************************/

export class Users {
  constructor(private api: TSAPIv2) {}

  /**
   * Creates a new user.  The name must be unique.
   * https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fcreate-user
   * @param user Contains the users values to set.
   * @returns The user created details.
   */
  async create(user: UserInfo): Promise<UserInfo> {
    // Add defaults if not provided.
    if (!user.account_type) {
      user.account_type = AccountType.LOCAL_USER;
    }
    if (!user.account_status) {
      user.account_status = AccountStatus.ACTIVE;
    }
    if (!user.visibility) {
      user.visibility = Visibility.SHAREABLE;
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
  async delete(user_identifier: Identifier): Promise<void> {
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
  async resetPassword(
    user_identifier: string,
    new_password: string
  ): Promise<void> {
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
  async search(searchOptions: UserSearchOptions | undefined = undefined): Promise<UserInfo[]> {
    const endpoint = `users/search`;
    return this.api.restApiCallV2(endpoint, "POST", searchOptions);
  }

  /**
   * Updates the user.  Note that passwords cannot be updated with this call.  The default is to REPLACE.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fusers%2Fupdate-user
   * @param user The parameters to update.
   * @returns None
   */
  async update(user_identifier: Identifier, user: UserInfo): Promise<void> {
    if (!user.operation) {
      user.operation = "REPLACE"; // required: REPLACE, ADD, REMOVE -- TODO - may have to support other operations.
    }
    const endpoint = `users/${user_identifier}/update`; // we could also use the name, which might be preferable.
    return this.api.restApiCallV2(endpoint, "POST", user);
  }

}
