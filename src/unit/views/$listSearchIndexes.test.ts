import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "empty object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $listSearchIndexes: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "id",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $listSearchIndexes: {
              id: "index",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "name",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $listSearchIndexes: {
              name: "index",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$listSearchIndexes", () => {
  runTestCases(testCases);
});
