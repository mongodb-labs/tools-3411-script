import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "unknown stage",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $unknown: 100,
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "multiple stages all safe",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $skip: 100,
          },
          {
            $limit: 100,
          },
          {
            $sort: { x: 1 },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multiple stages not all safe",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $skip: 100,
          },
          {
            $sort: { x: 1, y: 1 },
          },
          {
            $limit: 100,
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("misc", () => {
  runTestCases(testCases);
});
