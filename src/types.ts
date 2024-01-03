/**
 * Represents a custom type for an identifier.
 */
export type Identifier = string;

/**
 * Enum representing the privileges available in the system.
 */
export enum Privileges {
  UNKNOWN = "UNKNOWN",
  ADMINISTRATION = "ADMINISTRATION",
  AUTHORING = "AUTHORING",
  USERDATAUPLOADING = "USERDATAUPLOADING",
  DATADOWNLOADING = "DATADOWNLOADING",
  USERMANAGEMENT = "USERMANAGEMENT",
  SECURITYMANAGEMENT = "SECURITYMANAGEMENT",
  LOGICALMODELING = "LOGICALMODELING",
  DATAMANAGEMENT = "DATAMANAGEMENT",
  TAGMANAGEMENT = "TAGMANAGEMENT",
  SHAREWITHALL = "SHAREWITHALL",
  SYSTEMMANAGEMENT = "SYSTEMMANAGEMENT",
  JOBSCHEDULING = "JOBSCHEDULING",
  A3ANALYSIS = "A3ANALYSIS",
  EXPERIMENTALFEATUREPRIVILEGE = "EXPERIMENTALFEATUREPRIVILEGE",
  BYPASSRLS = "BYPASSRLS",
  RANALYSIS = "RANALYSIS",
  DISABLE_PINBOARD_CREATION = "DISABLE_PINBOARD_CREATION",
  DEVELOPER = "DEVELOPER",
  APPLICATION_ADMINISTRATION = "APPLICATION_ADMINISTRATION",
  USER_ADMINISTRATION = "USER_ADMINISTRATION",
  GROUP_ADMINISTRATION = "GROUP_ADMINISTRATION",
  ROLE_ADMINISTRATION = "ROLE_ADMINISTRATION",
  AUTHENTICATION_ADMINISTRATION = "AUTHENTICATION_ADMINISTRATION",
  BILLING_INFO_ADMINISTRATION = "BILLING_INFO_ADMINISTRATION",
  PREVIEW_THOUGHTSPOT_SAGE = "PREVIEW_THOUGHTSPOT_SAGE",
}

/**
 * An array containing all the values of the Privileges enum.
 * */
export const ALL_PRIVILEGES: string[] = Object.values(Privileges);

/**
 * Enum representing the types of user and group visibility in the system.
 */
export enum Visibility {
  SHARABLE = "SHARABLE",
  SHAREABLE = "SHARABLE",
  NON_SHARABLE = "NON_SHARABLE",
  NON_SHAREABLE = "NON_SHARABLE",
}

/**
 * Enum representing the standard sort orders.
 */
export enum SortOrder { 
    ASC = "ASC",
    DESC = "DESC",
}

/**
 * Enum representing the possible options for update operations.  
 * Not all options are available for all endpoints.
 */
export enum UpdateOperation {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE",
}

// ------------------ Metadata types ------------------

export enum FavoritesMetadataTypes {
    LIVEBOARD = "LIVEBOARD",
    ANSWER = "ANSWER",
}

export interface MetadataSearchOptions {
    dependent_object_version?: string;
    include_auto_created_objects?: boolean;
    include_dependent_objects?: boolean;
    include_details?: boolean;
    include_headers?: boolean;
    include_hidden_objects?: boolean;
    include_incomplete_objects?: boolean;
    include_visualization_headers?: boolean;
    record_offset?: number;
    record_size?: number;
    include_stats?: boolean;
    metadata?: Metadata[];
    permissions?: Permission[];
    created_by_user_identifiers?: string[];
    exclude_objects?: ExcludeObject[];
    favorite_object_options?: FavoriteObjectOptions;
    include_worksheet_search_assist_data?: boolean;
    modified_by_user_identifiers?: string[];
    sort_options?: SortOptions;
    tag_identifiers?: string[];
}

interface Metadata {
    identifier: string;
    name_pattern: string;
    type: string;
}

interface Permission {
    principal: {
        identifier: string;
        type: string;
    };
    share_mode: string;
}

interface ExcludeObject {
    identifier: string;
    type: string;
}

interface FavoriteObjectOptions {
    include?: boolean;
    user_identifiers?: string[];
}

interface SortOptions {
    // Define your sort options properties here
}
