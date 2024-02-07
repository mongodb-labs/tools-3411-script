import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "number",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $limit: 100,
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$limit", () => {
  runTestCases(testCases);
});
