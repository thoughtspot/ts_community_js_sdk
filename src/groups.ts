import { TSAPIv2 } from "./rest-api-v2.0";

import { Identifier, UpdateOperation, Visibility } from "./types";

/******************************************* Group Types **********************************************************/

export enum GroupType {
  LOCAL_GROUP = "LOCAL_GROUP",
  LDAP_GROUP = "LDAP_GROUP",
}

// defines search options for group search.
export interface GroupSearchOptions {
  record_offset?: number;
  record_size?: number;
  default_liveboard_identifiers?: string[];
  description?: string;
  display_name?: string;
  name_pattern?: string;
  group_identifier?: string;
  org_identifiers?: string[];
  privileges?: string[]; // TODO add enumerated type
  sub_group_identifiers?: string[];
  type?: GroupType;
  user_identifiers?: string[];
  visibility?: Visibility;
  role_identifiers?: string[];
}

export interface GroupOptions {
  name?: string;
  display_name?: string;
  type?: GroupType;
  visibility?: Visibility;
  default_liveboard_identifiers?: string[];
  description?: string;
  privileges?: string[];
  sub_group_identifiers?: string[];
  user_identifiers?: string[];
  role_identifiers?: string[];
  operation?: UpdateOperation; // only used for updates
}

interface GroupInfo {
  author_id: string;
  complete_detail: boolean;
  content: {
    [key: string]: string;
  };
  creation_time_in_millis: number;
  default_liveboards: {
    id: string;
    name: string;
  }[];
  display_name: string;
  id: string;
  name: string;
  visibility: Visibility;
}

/******************************************* Group Endpoints **********************************************************/

export class Groups {
  constructor(private api: TSAPIv2) {}

  /**
   * The group search endpoint searches for groups based on the search criteria.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fsearch-user-groups
   * @param searchOptions The options to search for as a JSON object.
   * @returns An object with the group search results.  See docs.
   */
  async search(searchOptions: GroupSearchOptions | undefined = undefined): Promise<GroupInfo[]> {
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
  async create(group: GroupOptions): Promise<GroupInfo> {
    if (!group.type) {
      group.type = GroupType.LOCAL_GROUP;
    }
    if (!group.visibility) {
      group.visibility = Visibility.SHAREABLE;
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
  async delete(group_identifier: Identifier): Promise<void> {
    const endpoint = `groups/${group_identifier}/delete`;
    return this.api.restApiCallV2(endpoint, "POST");
  }

  /**
   * Updates the group.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Fgroups%2Fupdate-user-group
   * @param group The updated group details.
   * @returns None
   */
  async update(
    group_identifier: Identifier,
    group: GroupOptions
  ): Promise<object> {
    if (!group.operation) {
      group.operation = UpdateOperation.REPLACE;
    }

    const endpoint = `groups/${group_identifier}/update`;
    return this.api.restApiCallV2(endpoint, "POST", group);
  }
}
