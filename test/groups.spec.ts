import { expect } from "chai";

import { api } from "./global";
import { Visibility } from "../src/types";

describe("Test Group API calls", () => {
  const randomVal = Math.floor(Math.random() * 1234567);
  const test_group_name = "test-group" + randomVal;

  const test_group = {
    name: test_group_name,
    display_name: "Test Group",
    description: "Test Group Description",
    visibility: Visibility.SHARABLE,
  };

  it("should create a new group with details", (done) => {
    api.groups
      .create({
        ...test_group,
      })
      .then((group) => {
        expect(group.name).equals(test_group.name);
        expect(group.display_name).equals(test_group.display_name);
        done();
      });
  });

  it("should be able to find the group details for an existing group", (done) => {
    api.groups.search({ group_identifier: test_group_name }).then((groups) => {
      expect(groups.length).equals(1);
      expect(groups[0].name).equals(test_group.name);
      done();
    });
  });

  it("should get an empty array if searching for a non-existant group", (done) => {
    api.groups
      .search({ group_identifier: "hopefully-unknown-group" })
      .then((groups) => {
        expect(groups).to.be.empty;
        done();
      });
  });

  it("should be able to update a group", (done) => {
    api.groups
      .update(test_group_name, {
        display_name: "Test Group Updated",
      })
      .then(() => {
        api.groups.search({ group_identifier: test_group_name }).then((groups) => {
          expect(groups.length).equals(1);
          expect(groups[0].name).equals(test_group.name);
          expect(groups[0].display_name).equals("Test Group Updated");
          done();
        });
      });
  });

  it("should be able to delete a group", (done) => {
    api.groups.delete(test_group_name).then(() => {
      api.groups.search({ group_identifier: test_group_name }).then((groups) => {
        expect(groups).to.be.empty;
        done();
      });
    });
  });
});
