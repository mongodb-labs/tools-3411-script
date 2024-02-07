import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "string _id, no fields",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $group: {
              _id: "$x",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "single-key object _id, no fields",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $group: {
              _id: { x: 1 },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object _id, no fields",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $group: {
              _id: { x: 1, y: 1 },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "string _id, multiple single-object fields",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $group: {
              _id: "$x",
              count: { $count: {} },
              y: { $first: "$y" },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "string _id, multiple multi-object fields",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $group: {
              _id: "$x",
              count: { $count: {} },
              y: { $first: { $literal: { x: 1, y: 1 } } },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$group", () => {
  runTestCases(testCases);
});
