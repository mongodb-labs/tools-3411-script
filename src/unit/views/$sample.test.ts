import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $sample: { size: 100 },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$sample", () => {
  runTestCases(testCases);
});
