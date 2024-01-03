/**
 * This file contains functions for working with the REST API v2.0 data endpoints.
 * Note that the actual endpoints for data calls are either top-level of metadata, but
 * they are grouped together in the playground, so they will be grouped here as well.
 */

import {TSAPIv2} from "./rest-api-v2.0";

/***************************************** Types ************************************************/

type DataFormat = ('COMPACT');

type RuntimeProperties = { [key: string]: string };

interface SearchDataParams {
    query_string: string;
    logical_table_identifier: string;
    data_format?: DataFormat;
    record_offset?: number;
    record_size?: number;
    runtime_filter?: RuntimeProperties;
    runtime_sort?: RuntimeProperties;
    runtime_param_override?: RuntimeProperties;
}

interface DataRow {
    [key: string]: string;
}

interface Content {
    available_data_row_count: number;
    column_names: string[];
    data_rows: DataRow[];
    record_offset: number;
    record_size: number;
    returned_data_row_count: number;
    sampling_ratio: number;
}

interface SearchDataResponse {
    contents: Content[];
}

interface LiveboardDataParams {
  metadata_identifier: string;
  data_format?: DataFormat;
  record_offset?: number;
  record_size?: number;
  visualization_identifiers?: string[];
  transient_content?: string;
  runtime_filter?: RuntimeProperties;
  runtime_sort?: RuntimeProperties;
  runtime_param_override?: RuntimeProperties;
}

interface LiveboardContent {
  available_data_row_count: number;
  column_names: string[];
  data_rows: DataRow[];
  record_offset: number;
  record_size: number;
  returned_data_row_count: number;
  sampling_ratio: number;
  visualization_id: string;
  visualization_name: string;
}

interface LiveboardDataResponse {
  metadata_id: string;
  metadata_name: string;
  contents: LiveboardContent[];
}

interface AnswerDataParams {
  metadata_identifier: string;
  data_format?: DataFormat;
  record_offset?: number;
  record_size?: number;
  runtime_filter?: RuntimeProperties;
  runtime_sort?: RuntimeProperties;
  runtime_param_override?: RuntimeProperties;
}

interface AnswerContent {
  available_data_row_count: number;
  column_names: string[];
  data_rows: DataRow[];
  record_offset: number;
  record_size: number;
  returned_data_row_count: number;
  sampling_ratio: number;
}

interface AnswerDataResponse {
  metadata_id: string;
  metadata_name: string;
  contents: AnswerContent[];
}
/************************************* Data Endpoints *******************************************/

export class Data {
    constructor(private api: TSAPIv2) {
    }

    async searchData(params: SearchDataParams): Promise<SearchDataResponse> {
        return this.api.restApiCallV2('searchdata', 'POST', params);
    }

    async liveboardData(params: LiveboardDataParams): Promise<LiveboardDataResponse> {
        return this.api.restApiCallV2('metadata/liveboard/data', 'POST', params);
    }

    async answerData(params: AnswerDataParams): Promise<AnswerDataResponse> {
        return this.api.restApiCallV2('metadata/answer/data', 'POST', params);
    }
}