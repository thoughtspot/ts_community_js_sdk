import { assert, expect } from "chai"

import { ALL_PRIVILEGES } from "../src/types"

describe('Type Tests', () => {
    it ("All privelegs should include ADMINISTRATION", () => {
      const allPrivileges = ALL_PRIVILEGES;
      expect(allPrivileges).to.be.an("array").include("ADMINISTRATION");
    })
});
