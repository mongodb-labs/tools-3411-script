import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "simple",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $fill: {
              partitionBy: "$x",
              sortBy: {
                x: 1,
              },
              output: {
                x: { value: "value" },
              },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key partitionBy",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $fill: {
              partitionBy: { x: 1, y: 1 },
              sortBy: {
                x: 1,
              },
              output: {
                x: { value: "x" },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "multi-key sortBy",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $fill: {
              partitionBy: "$x",
              sortBy: {
                x: 1,
                y: 1,
              },
              output: {
                x: { value: "x" },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "multi-key output",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $fill: {
              partitionBy: "$x",
              sortBy: {
                x: 1,
              },
              output: {
                x: { value: "x" },
                y: { value: "y" },
              },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$fill", () => {
  runTestCases(testCases);
});
