import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [{ $sort: { x: 1 } }],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [{ $sort: { x: 1, y: 1 } }],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "single-key object and multi-key $sort",
    collection: {
      type: "view",
      options: {
        pipeline: [{ $sort: { x: 1 } }, { $sort: { x: 1, y: 1 } }],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$sort", () => {
  runTestCases(testCases);
});
