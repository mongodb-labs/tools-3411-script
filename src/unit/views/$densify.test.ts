import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "string bounds",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $densify: {
              field: "field",
              partitionByFields: ["x", "y", "z"],
              range: {
                step: 1,
                unit: "seconds",
                bounds: "partition",
              },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "array bounds",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $densify: {
              field: "field",
              partitionByFields: ["x", "y", "z"],
              range: {
                step: 1,
                unit: "seconds",
                bounds: [0, 1000],
              },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$densify", () => {
  runTestCases(testCases);
});
