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
            $redact: "$$DESCEND",
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "single-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $redact: {
              $literal: "$$DESCEND",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "nested multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $redact: {
              $getField: {
                input: {
                  $top: {
                    output: [
                      {
                        $literal: {
                          value: "$$PRUNE",
                          x: 10,
                          y: 100,
                        },
                      },
                      {
                        $literal: {
                          value: "$$KEEP",
                          x: 1,
                          y: 1000,
                        },
                      },
                    ],
                    sortBy: {
                      x: 1,
                      y: 1,
                    },
                  },
                },
                field: "value",
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "top-level multi-key object",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $redact: {
              x: 1,
              y: 1,
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$redact", () => {
  runTestCases(testCases);
});
