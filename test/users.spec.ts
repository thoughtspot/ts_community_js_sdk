import { expect } from "chai";

import { api } from "./global";
import { Visibility } from "../src/types";

describe("Test User API calls", () => {
  const randomVal = Math.floor(Math.random() * 1234567);
  const test_user_name = "test-user" + randomVal;
  const randomPwd = "adjkfl!45qDFJKe34" + randomVal;

  const test_user = {
    name: test_user_name,
    display_name: "Test User",
    password: randomPwd,
    email: "bill.back@thoughtspot.com",
    group_identifiers: ["Developers"],
    org_identifiers: ["Bill Back"],
    visibility: Visibility.SHAREABLE,
  };

  it("should create a new user with details", (done) => {
    api.users
      .create({
        ...test_user,
      })
      .then((user) => {
        expect(user.name).equals(test_user.name);
        expect(user.display_name).equals(test_user.display_name);
        done();
      });
  });

  it("should be able to find the user details for an existing user", (done) => {
    api.users.search({ user_identifier: test_user_name }).then((users) => {
      expect(users.length).equals(1);
      expect(users[0].name).equals(test_user.name);
      done();
    });
  });

  it("should get an empty array if searching for a non-existent user", (done) => {
    api.users
      .search({ user_identifier: "hopefully-unknown-user" })
      .then((users) => {
        expect(users).to.be.empty;
        done();
      });
  });

  it("should be able to update a user", (done) => {
    api.users
      .update(test_user_name, {
        display_name: "Test User Updated",
      })
      .then(() => {
        api.users.search({ user_identifier: test_user_name }).then((users) => {
          expect(users.length).equals(1);
          expect(users[0].name).equals(test_user.name);
          expect(users[0].display_name).equals("Test User Updated");
          done();
        });
      });
  });

  it("should be able to reset the user's password", (done) => {
    // Just make sure this doesn't throw an error.
    api.users.resetPassword(test_user_name, randomPwd + "xx").then(() => {
      done();
    });
  });

  it("should be able to delete a user", (done) => {
    api.users.delete(test_user_name).then(() => {
      api.users.search({ user_identifier: test_user_name }).then((users) => {
        expect(users).to.be.empty;
        done();
      });
    });
  });
});
