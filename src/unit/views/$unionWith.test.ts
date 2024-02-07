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
            $unionWith: "collection",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "pipeline with no multi-key documents",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $unionWith: {
              coll: "collection",
              pipeline: [{ $sort: { x: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "pipeline with multi-key documents",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $unionWith: {
              coll: "collection",
              pipeline: [{ $sort: { x: 1, y: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$unionWith", () => {
  runTestCases(testCases);
});
