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
            $collStats: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $collStats: {
              latencyStats: { histograms: true },
              storageStats: { scale: 100 },
              count: {},
              queryExecStats: {},
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$collStats", () => {
  runTestCases(testCases);
});
