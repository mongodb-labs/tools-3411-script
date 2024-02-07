import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "empty object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $planCacheStats: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$planCacheStats", () => {
  runTestCases(testCases);
});
