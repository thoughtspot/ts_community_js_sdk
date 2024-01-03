import { expect } from "chai";

import { api } from "./global";

describe("Test Role API calls", () => {
  const randomVal = Math.floor(Math.random() * 1234567);
  const test_role_name = "test-role" + randomVal;

  const test_role = {
    name: test_role_name,
    description: "Test Role Description",
    privileges: ["DATADOWNLOADING", "DATAMANAGEMENT"],
  };

  it("should create a new role with details", (done) => {
    api.roles
      .create({
        ...test_role,
      })
      .then((role) => {
        expect(role.name).equals(test_role.name);
        expect(role.description).equals(test_role.description);
        done();
      });
  });

  it("should be able to find the role details for an existing role", (done) => {
    api.roles.search({ role_identifiers: [test_role_name] }).then((roles) => {
      expect(roles.length).equals(1);
      expect(roles[0].name).equals(test_role.name);
      done();
    });
  });

  it("should get an empty array if searching for a non-existant role", (done) => {
    api.roles
      .search({ role_identifiers: ["hopefully-unknown-role"] })
      .then((roles) => {
        expect(roles).to.be.empty;
        done();
      });
  });

  it("should be able to update a role", (done) => {
    api.roles
      .update(test_role_name, {
        name: test_role_name,
        description: "Test Role Updated",
      })
      .then(() => {
        api.roles.search({ role_identifiers: [test_role_name] }).then((roles) => {
          expect(roles.length).equals(1);
          expect(roles[0].name).equals(test_role.name);
          expect(roles[0].description).equals("Test Role Updated");
          done();
        });
      });
  });

  it("should be able to delete a role", (done) => {
    api.roles.delete(test_role_name).then(() => {
      api.roles.search({ role_identifiers: [test_role_name] }).then((roles) => {
        expect(roles).to.be.empty;
        done();
      });
    });
  });
});
