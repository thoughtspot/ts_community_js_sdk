import { TSAPIv2 } from "./rest-api-v2.0";

import { Identifier, Privileges, UpdateOperation, Visibility } from "./types";

/******************************************* Role Types **********************************************************/

enum RolePermission {
    READ_ONLY = "READ_ONLY",
    MODIFY = "MODIFY",
    NO_ACCESS = "NO_ACCESS",
}

interface RoleDetails {
    name: string;  // You always need a name, even when updating.
    description?: string;
    privileges?: Privileges[];
}

interface RoleSearchOptions {
    role_identifiers?: Identifier[];
    org_identifiers?: Identifier[];
    group_identifiers?: Identifier[];
    privileges?: Privileges[];
    deprecated?: boolean;
    external?: boolean;
    shared_via_connection?: boolean;
    permissions?: RolePermission[];
}

interface SearchRoleResponse {
    id: string;
    name: string;
    description: string;
    groups_assigned_count: number | null;
    orgs: GenericInfo[]; // Replace with the actual type
    groups: GenericInfo[]; // Replace with the actual type
    privileges: Privileges[]; // Replace with the actual type
    permission: string;
    author_id: string;
    modifier_id: string;
    creation_time_in_millis: number;
    modification_time_in_millis: number;
    deleted: boolean;
    deprecated: boolean;
    external: boolean;
    hidden: boolean;
    shared_via_connection: boolean;
}

interface GenericInfo {
    id: string;
    name: string;
}

/******************************************* Role Endpoints **********************************************************/

export class Roles {

    constructor(private api: TSAPIv2) { }
  /**
   * The role search endpoint searches for users based on the search criteria.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fsearch-roles
   * @param searchOptions The options to search for as a JSON object.
   * @returns An object with the role search results.  See docs.
   */
  async search(searchOptions: RoleSearchOptions | undefined = {}): Promise<SearchRoleResponse[]> {

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
  async create(role: object): Promise<SearchRoleResponse> {
    const endpoint = `roles/create`;
    return this.api.restApiCallV2(endpoint, "POST", role);
  }

  /**
   * Deletes the role with the given identifier (name or id).
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fdelete-role
   * @param role_identifier The name or ID for the role.
   * @returns Nothing
   */
  async delete(role_identifier: Identifier): Promise<void> {
    const endpoint = `roles/${role_identifier}/delete`;
    return this.api.restApiCallV2(endpoint, "POST");
  }

  /**
   * Updates the role.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Froles%2Fupdate-role
   * @param role The updated role details.
   * @returns None
   */
  async update(role_identifier: Identifier, role: RoleDetails): Promise<void> {
    const endpoint = `roles/${role_identifier}/update`; // we could also use the name, which might be preferable.
    return this.api.restApiCallV2(endpoint, "POST", role);
  }
}
