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
            $unwind: "field",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $unwind: {
              path: "field",
              includeArrayIndex: "index",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$unwind", () => {
  runTestCases(testCases);
});
