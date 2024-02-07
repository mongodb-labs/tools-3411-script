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
            $bucket: {
              groupBy: "$x",
              boundaries: [1, 2, 3],
              default: "default",
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
            $bucket: {
              groupBy: {
                x: 1,
                y: 1,
              },
              boundaries: [1, 2, 3],
              default: "default",
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
            $bucket: {
              groupBy: "$x",
              boundaries: [1, 2, 3],
              default: "default",
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

describe("$bucket", () => {
  runTestCases(testCases);
});
