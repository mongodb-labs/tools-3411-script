import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "single-key startWith, single-key restrictSearchWithMatch",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $graphLookup: {
              from: "coll",
              startWith: "$x",
              connectFromField: "fromField",
              connectToField: "toField",
              as: "field",
              maxDepth: 10,
              depthField: "depth",
              restrictSearchWithMatch: { x: 1 },
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "single-key startWith, multi-key restrictSearchWithMatch",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $graphLookup: {
              from: "coll",
              startWith: "$x",
              connectFromField: "fromField",
              connectToField: "toField",
              as: "field",
              maxDepth: 10,
              depthField: "depth",
              restrictSearchWithMatch: { x: 1, y: 1 },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "multi-key startWith, single-key restrictSearchWithMatch",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $graphLookup: {
              from: "coll",
              startWith: { x: 1, y: 1 },
              connectFromField: "fromField",
              connectToField: "toField",
              as: "field",
              maxDepth: 10,
              depthField: "depth",
              restrictSearchWithMatch: { x: 1 },
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$graphLookup", () => {
  runTestCases(testCases);
});
