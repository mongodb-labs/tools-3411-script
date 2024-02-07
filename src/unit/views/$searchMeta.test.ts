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
            $searchMeta: {
              range: {
                path: "year",
                gte: 1998,
                lt: 1999,
              },
              count: {
                type: "total",
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
