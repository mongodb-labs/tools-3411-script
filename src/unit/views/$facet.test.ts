import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single-key object, pipeline with no multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $facet: {
              a: [{ $sort: { x: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "single-key object, pipeline with multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $facet: {
              a: [{ $sort: { x: 1, y: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "multi-key object, pipelines with no multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $facet: {
              a: [{ $sort: { x: 1 } }],
              b: [{ $sort: { x: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "multi-key object, pipelines with multi-key objects",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $facet: {
              a: [{ $sort: { x: 1, y: 1 } }],
              b: [{ $sort: { x: 1, y: 1 } }],
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$facet", () => {
  runTestCases(testCases);
});
