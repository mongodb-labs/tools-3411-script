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
            $indexStats: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$indexStats", () => {
  runTestCases(testCases);
});
