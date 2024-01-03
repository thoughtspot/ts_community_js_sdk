import { TSAPIv2 } from "./rest-api-v2.0";

import { Identifier, UpdateOperation, Visibility } from "./types";

/******************************************* Org Types **********************************************************/

export enum OrgVisibility {
  SHOW = "SHOW",
  HIDDEN = "HIDDEN",
}

export interface OrgSearchOptions {
  org_identifier?: string;
  description?: string;
  visibility?: OrgVisibility;
  status?: string;
  user_identifiers?: Identifier[];
}

export interface OrgOptions {
  name: string;
  description?: string;
  userIdentifiers?: Identifier[]; // only used for updates
}

export interface OrgInfo {
  id: number;
  name: string;
  status: string;
  description: string;
  visibility: OrgVisibility;
}

/******************************************* Org Endpoints **********************************************************/

export class Orgs {
  /** Create a new org endpoint. */
  constructor(private api: TSAPIv2) {}

  /**
   * The org search endpoint searches for users based on the search criteria.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fsearch-user-orgs
   * @param {object} searchOptions The options to search for as a JSON object.
   * @returns An object with the org search results.  See docs.
   */
  async search(
    searchOptions: OrgSearchOptions | undefined = undefined
  ): Promise<OrgInfo[]> {
    const endpoint = `orgs/search`;

    // This bit of clunky code is because the API doesn't return an empty array when there are no results, but rather returns a 400 error.
    // The challenge is that the user may have badly formatted content, so this may incorrectly work.
    let orgs: OrgInfo[];
    try {
      orgs = await this.api.restApiCallV2(endpoint, "POST", searchOptions);
    } catch (error: unknown) {
      console.error("Error searching for orgs: ", error);
      if (error instanceof Error) {
        if (error.message.indexOf("400") === -1) {
          throw error;
        } else {
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
  async create(org: OrgOptions): Promise<OrgInfo> {
    const endpoint = `orgs/create`;
    return this.api.restApiCallV2(endpoint, "POST", org);
  }

  /**
   * Deletes the org with the given identifier (name or id).
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fdelete-org
   * @param org_identifier Either the name or the ID of the org.
   * @returns None
   */
  async delete(org_identifier: Identifier): Promise<void> {
    const endpoint = `orgs/${org_identifier}/delete`;
    return this.api.restApiCallV2(endpoint, "POST");
  }

  /**
   * Updates the org.
   * See https://developers.thoughtspot.com/docs/restV2-playground?apiResourceId=http%2Fapi-endpoints%2Forgs%2Fupdate-user-org
   * @param org The updated org.
   * @returns None
   */
  async update(org_identifier: Identifier, org: object): Promise<void> {
    const endpoint = `orgs/${org_identifier}/update`; // we could also use the name, which might be preferable.
    return this.api.restApiCallV2(endpoint, "POST", org);
  }
}
