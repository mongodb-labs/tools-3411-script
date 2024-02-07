import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "nested multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $search: {
              near: {
                path: "released",
                origin: "2011-09-01T00:00:00.000+00:00",
                pivot: 7776000000,
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$search", () => {
  runTestCases(testCases);
});
