/*
 * Purpose: Test for the rest-api-v2.0.ts file.
 */
import { expect } from "chai";

import { config } from "./config";
import { api } from "./global";

describe("Test TSAPIv2", () => {
  it("should create a TSAPIv2 object with username and password", () => {
    expect(api.tsURL).to.equal(config.tsURL);
    expect(api.username).to.equal(config.username);
    expect(api.token).to.be.a("string").and.not.empty;
  });

  it("should successfully call system info with the basic call structure", () => {
    api.restApiCallV2("system", "GET").then((systemInfo) => {
      expect(systemInfo).to.have.property("id");
      expect(systemInfo.id).to.not.be.empty;
    });
  });

  it("should give me a token", () => {
    const token = api.token;
    expect(token).to.be.a("string").and.not.empty;
  });
});
