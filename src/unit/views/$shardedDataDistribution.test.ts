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
            $shardedDataDistribution: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$shardedDataDistribution", () => {
  runTestCases(testCases);
});
