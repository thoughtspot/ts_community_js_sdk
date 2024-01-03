/**
 * This file contains functions for working with the REST API v2.0.
 *
 * TODO - add additional endpoints.
 */

import {} from "./types";

import { TSAPIv2, getFullV2Endpoint } from "./rest-api-v2.0";

/***************************************** Types ************************************************/

interface SystemConfig {
  onboarding_content_url: string;
}

interface SystemInfo {
  id: string;
  name: string;
  release_version: string;
  time_zone: string;
  locale: string;
  date_format: string;
  api_version: string;
  type: string;
  environment: string;
  license: string;
  date_time_format: string;
  time_format: string;
  system_user_id: string;
  super_user_id: string;
  hidden_object_id: string;
  system_group_id: string;
  tsadmin_user_id: string;
  admin_group_id: string;
  all_tables_connection_id: string;
  all_user_group_id: string;
  accept_language: string;
  all_user_group_member_user_count: number;
  logical_model_version: number;
}

interface SystemOverrides {
  config_override_info: object;
  __args: object;
}

/***************************************** Authentication Endpoints ************************************************/

export class System {
  constructor(private api: TSAPIv2) {}

  /**
   * Returns the system config.
   */
  async config(): Promise<SystemConfig> {
    const endpoint = `system/config`;

    return this.api.restApiCallV2(endpoint, "GET");
  }

  async config_overrides(): Promise<SystemOverrides> {
    const endpoint = `system/config-overrides`;
    return this.api.restApiCallV2(endpoint, "GET");
  }

  /**
   * Updates the configuration.  The body is an object with key/value pairs and the keys must be valid override keys.
   */
  async config_update(config: object): Promise<void> {
    const endpoint = `system/config-update`;
    return this.api.restApiCallV2(endpoint, "POST", config);
  }

  /**
   * Returns the system info.
   */
  async system(): Promise<SystemInfo> {
    const endpoint = `system`;

    return this.api.restApiCallV2(endpoint, "GET");
  }

}
