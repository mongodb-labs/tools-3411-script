import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "point",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $geoNear: {
              near: { type: "Point", coordinates: [-73.99279, 40.719296] },
              distanceField: "dist.calculated",
              maxDistance: 2,
              query: { category: "Parks" },
              includeLocs: "dist.location",
              spherical: true,
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$geoNear", () => {
  runTestCases(testCases);
});
