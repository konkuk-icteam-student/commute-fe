import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDistanceInMeters, isWithinRadius } from "./location";

const workLocation = {
  latitude: 37.5402096,
  longitude: 127.0736448,
};

describe("home location utils", () => {
  it("calculates zero distance for the same coordinates", () => {
    assert.equal(getDistanceInMeters(workLocation, workLocation), 0);
  });

  it("detects a target within 50 meters", () => {
    const nearbyLocation = {
      latitude: 37.5403,
      longitude: 127.0737,
    };

    assert.equal(
      isWithinRadius({
        center: workLocation,
        target: nearbyLocation,
        radiusMeters: 50,
      }),
      true,
    );
  });

  it("detects a target outside 50 meters", () => {
    const farLocation = {
      latitude: 37.5412,
      longitude: 127.0736448,
    };

    assert.equal(
      isWithinRadius({
        center: workLocation,
        target: farLocation,
        radiusMeters: 50,
      }),
      false,
    );
  });
});
