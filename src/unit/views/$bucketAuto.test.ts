import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "string groupBy, single output",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $bucketAuto: {
              groupBy: "$x",
              buckets: 5,
              granularity: "R5",
              output: {
                x: {
                  $sum: 1,
                },
              },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object groupBy, single output",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $bucketAuto: {
              groupBy: {
                x: 1,
                y: 1,
              },
              buckets: 5,
              granularity: "R5",
              output: {
                x: {
                  $sum: 1,
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
    description: "string groupBy, multiple outputs",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $bucketAuto: {
              groupBy: "$x",
              buckets: 5,
              granularity: "R5",
              output: {
                x: {
                  $sum: 1,
                },
                y: {
                  $sum: 1,
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

describe("$bucketAuto", () => {
  runTestCases(testCases);
});
