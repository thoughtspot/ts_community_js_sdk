/**
 * This file contains general utility functions.
 */

/** Sleeps for the number of seconds. */
export const sleep = async (sec: number) => {
  await new Promise((r) => setTimeout(r, sec * 1000));
};
