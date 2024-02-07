import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $set: {
              a: "$x",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object with single-key nested object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $set: {
              a: "$x",
              b: 1,
              c: { $literal: { d: 1 } },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object with multi-key nested object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $set: {
              a: "$x",
              c: { $literal: { d: 1, e: 1 } },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$set", () => {
  runTestCases(testCases);
});
