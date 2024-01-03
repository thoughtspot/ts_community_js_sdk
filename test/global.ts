/**
 * Contains globals for Mocha tests.
 */

import { config } from "./config";
import { TSAPIv2 } from "../src/rest-api-v2.0";

export const api = new TSAPIv2({ ...config });

// Wait for the token to be ready before running any tests.
beforeEach(() => {
  return api.waitForToken();
});