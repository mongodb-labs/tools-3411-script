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
            $count: "field",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$count", () => {
  runTestCases(testCases);
});
