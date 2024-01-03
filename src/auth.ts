/**
 * This file contains functions for working with the REST API v2.0.
 */

import {} from "./types";

import { TSAPIv2, getFullV2Endpoint } from "./rest-api-v2.0";

/***************************************** Types ************************************************/

interface Token {
  token: string;
}

interface SessionInfo {
  id: string;
  name: string;
  display_name: string;
  visibility: string;
  author_id: string;
  can_change_password: boolean;
  complete_detail: boolean;
  creation_time_in_millis: number;
  current_org: {
    id: number;
    name: string;
  };
  deleted: boolean;
  deprecated: boolean;
  account_type: string;
  account_status: string;
  email: string;
  expiration_time_in_millis: number;
  external: boolean;
  favorite_metadata: any[];
  first_login_time_in_millis: number;
  group_mask: number;
  hidden: boolean;
  home_liveboard: null;
  incomplete_details: any[];
  is_first_login: boolean;
  modification_time_in_millis: number;
  modifier_id: string;
  notify_on_share: boolean;
  onboarding_experience_completed: boolean;
  orgs: {
    id: number;
    name: string;
  }[];
  owner_id: string;
  parent_type: string;
  privileges: string[];
  show_onboarding_experience: boolean;
  super_user: boolean;
  system_user: boolean;
  tags: any[];
  tenant_id: string;
  user_groups: any[];
  user_inherited_groups: any[];
  welcome_email_sent: boolean;
  org_privileges: null;
  preferred_locale: string;
  extended_properties: {
    displayNameLastUpdatedBy: string;
  };
  extended_preferences: {
    numTimesDisplayNameDialogShown: number;
    savedAuthorFilter: string;
  };
}

/***************************************** Authentication Endpoints ************************************************/

export class Auth {

  constructor(private api: TSAPIv2) {}

  /**
   * Returns the session info for the currently logged in user.
   */
  async sessionUser(): Promise<SessionInfo> {
    const endpoint = `auth/session/user`;

    return this.api.restApiCallV2(endpoint, "GET");
  }

  async tokenFull(username: string, password: string, orgId: string | number = 0, validity_time_in_sec = 3600): Promise<Token> {
    const header: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const tokenData = {
      username: username,
      password: password,
      org_id: orgId,
      validity_time_in_sec: validity_time_in_sec,
    };

    const tokenEndpoint = getFullV2Endpoint(this.api.tsURL, "/auth/token/full");
    console.log('calling auth/token/full');
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: header,
      credentials: "include",
      body: JSON.stringify(tokenData),
    });

    if (!response.ok) {
      throw new Error(
        `Error calling ${tokenEndpoint} response: ${response.status}`
      );
    }

    return response.json();
  }
}
