import {expect} from "chai";

import {api} from "./global";
import {dataParameters} from "./config";

describe("Test Data API calls", () => {

    it("should search a worksheet for data", (done) => {
        api.data
            .searchData({
                query_string: dataParameters.worksheetSearch,
                logical_table_identifier: dataParameters.worksheetGUID
            })
            .then((response) => {
                expect(response.contents[0].available_data_row_count).to.eq(10);
                expect(response.contents[0].column_names.length).to.eq(2);
                expect(response.contents[0].data_rows.length).to.eq(10);
                done();
            })
            .catch(error => {
                console.error(error)
                done(error);
            });
    });

    it("should search a liveboard for data", (done) => {
        api.data
            .liveboardData({
                metadata_identifier: dataParameters.liveboardGUID
            })
            .then((response) => {
                expect(response.metadata_id).eq(dataParameters.liveboardGUID);
                expect(response.metadata_name).eq(dataParameters.liveboardName);
                expect(response.contents.length).to.be.gt(0); // some data
                done();
            })
            .catch(error => {
                console.error(error)
                done(error);
            });
    });

    it("should search a liveboard viz for data", (done) => {
        api.data
            .liveboardData({
                metadata_identifier: dataParameters.liveboardGUID,
                visualization_identifiers: [dataParameters.liveboardViz],
                record_size: 20 // Assumes at least 20 rows in the data.
            })
            .then((response) => {
                expect(response.metadata_id).eq(dataParameters.liveboardGUID);
                expect(response.metadata_name).eq(dataParameters.liveboardName);
                expect(response.contents.length).to.be.eq(1); // some data
                expect(response.contents[0].available_data_row_count).to.eq(20);
                expect(response.contents[0].column_names.length).to.gt(0);
                done();
            })
            .catch(error => {
                console.error(error)
                done(error);
            });
    });

    it("should search an answer for data", (done) => {
        api.data
            .answerData({
                metadata_identifier: dataParameters.answerGUID
            })
            .then((response) => {
                expect(response.contents[0].available_data_row_count).to.eq(10);
                expect(response.contents[0].column_names.length).to.eq(4);
                expect(response.contents[0].data_rows.length).to.eq(10);
                done();
            })
            .catch(error => {
                console.error(error)
                done(error);
            });
    });
});