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
            $addFields: {
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
            $addFields: {
              a: "$x",
              b: 1,
              c: { d: 1 },
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
            $addFields: {
              a: "$x",
              b: { c: 1, d: 1 },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$addFields", () => {
  runTestCases(testCases);
});
