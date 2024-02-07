import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "top-level single-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $match: {
              x: 1,
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "top-level single-key object with nested multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $match: {
              x: { x: 1, y: 1 },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "top-level multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $match: {
              x: 1,
              y: 1,
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "top-level multi-key object with nested multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $match: {
              x: { x: 1, y: 1 },
              y: 1,
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$match", () => {
  runTestCases(testCases);
});
