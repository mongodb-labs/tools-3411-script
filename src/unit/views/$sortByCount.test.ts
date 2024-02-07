import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "string",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $sortByCount: "field",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "single-key object expression",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $sortByCount: {
              $mergeObjects: ["$field", { $literal: { x: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object expression",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $sortByCount: {
              $mergeObjects: ["$field", { $literal: { x: 1, y: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$sortByCount", () => {
  runTestCases(testCases);
});
