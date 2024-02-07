import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single window operator",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $setWindowFields: {
              partitionBy: "$x",
              sortBy: { x: 1 },
              output: {
                x: {
                  $sum: "$x",
                  window: {
                    documents: ["a", "z"],
                  },
                },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "single window operator, multi-key partitionBy",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $setWindowFields: {
              partitionBy: { x: 1, y: 1 },
              sortBy: { x: 1 },
              output: {
                x: {
                  $sum: "$x",
                  window: {
                    documents: ["a", "z"],
                  },
                },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "single window operator, multi-key sort",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $setWindowFields: {
              partitionBy: "$x",
              sortBy: { x: 1, y: 1 },
              output: {
                x: {
                  $sum: "$x",
                  window: {
                    documents: ["a", "z"],
                  },
                },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$setWindowFields", () => {
  runTestCases(testCases);
});
