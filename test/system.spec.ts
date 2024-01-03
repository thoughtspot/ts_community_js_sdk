import { expect } from "chai";

import { api } from "./global";

describe("Test System API calls", () => {
  it("should create a new role with details", (done) => {
    api.system.system().then((system) => {
      expect(system.release_version).to.not.be.empty;
      expect(system.name).to.not.be.empty;
    });
    done();
  });

  it("should get the system configuration", (done) => {
    api.system.config().then((config) => {
      expect(config.onboarding_content_url).to.not.be.empty;
    });
    done();
  });

  it("should get the system overrides", (done) => {
    api.system.config_overrides().then((overrides) => {
      expect(overrides.config_override_info).to.not.be.empty;
    });
    done();
  });

  it("should fail when updating overrides with bad values.", (done) => {
    api.system.config_update({ bad_key: "bad_value" }).catch((err) => {
      expect(err).to.not.be.null;
      done();
    });
  });
});
