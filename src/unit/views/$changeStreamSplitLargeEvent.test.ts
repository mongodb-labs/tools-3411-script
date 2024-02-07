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
            $changeStreamSplitLargeEvent: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$changeStreamSplitLargeEvent", () => {
  runTestCases(testCases);
});
