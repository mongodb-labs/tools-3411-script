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
            $unset: "field",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "array",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $unset: ["a", "b", "c"],
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$unset", () => {
  runTestCases(testCases);
});
