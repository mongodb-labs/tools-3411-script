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
            $skip: 100,
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$skip", () => {
  runTestCases(testCases);
});
