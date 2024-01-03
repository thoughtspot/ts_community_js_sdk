import { expect } from "chai";

import { api } from "./global";
import { Visibility } from "../src/types";

describe("Test Org API calls", () => {
  const randomVal = Math.floor(Math.random() * 1234567);
  const test_org_name = "test-org" + randomVal;
  const test_org_description = "Test org";

  const test_org = {
    name: test_org_name,
    description: test_org_description,
  };

  it("should create a new org with details", (done) => {
    api.orgs
      .create({
        ...test_org,
      })
      .then((org) => {
        expect(org.name).equals(test_org.name);
        expect(org.description).equals(test_org.description);
        done();
      });
  });

  it("should be able to find the org details for an existing org", (done) => {
    api.orgs.search({ org_identifier: test_org_name }).then((orgs) => {
      expect(orgs.length).equals(1);
      expect(orgs[0].name).equals(test_org.name);
      done();
    });
  });

  it("should get an empty array if searching for a non-existant org", (done) => {
    api.orgs
      .search({ org_identifier: "hopefully-unknown-org" })
      .then((orgs) => {
        expect(orgs).to.be.empty;
        done();
      });
  });

  it("should be able to update a org", (done) => {
    api.orgs
      .update(test_org_name, {
        description: "Test Org Updated",
      })
      .then(() => {
        api.orgs.search({ org_identifier: test_org_name }).then((orgs) => {
          expect(orgs.length).equals(1);
          expect(orgs[0].name).equals(test_org.name);
          expect(orgs[0].description).equals("Test Org Updated");
          done();
        });
      });
  });

  it("should be able to delete a org", (done) => {
    api.orgs.delete(test_org_name).then(() => {
      api.orgs.search({ org_identifier: test_org_name }).then((orgs) => {
        expect(orgs).to.be.empty;
        done();
      });
    });
  });
});
