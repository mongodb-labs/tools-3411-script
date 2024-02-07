// {
//     $lookup:
//        {
//           from: <joined collection>,
//           let: { <var_1>: <expression>, …, <var_n>: <expression> },
//           pipeline: [ <pipeline to run on joined collection> ],
//           as: <output array field>
//        }
//  }

// {
//     $lookup:
//       {
//         from: <collection to join>,
//         localField: <field from the input documents>,
//         foreignField: <field from the documents of the "from" collection>,
//         as: <output array field>
//       }
//  }

// {
//     $lookup:
//        {
//           from: <foreign collection>,
//           localField: <field from local collection's documents>,
//           foreignField: <field from foreign collection's documents>,
//           let: { <var_1>: <expression>, …, <var_n>: <expression> },
//           pipeline: [ <pipeline to run> ],
//           as: <output array field>
//        }
//  }

import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "no pipeline",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $lookup: {
              from: "collection",
              localField: "local",
              foreignField: "foreign",
              as: "field",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "pipeline with no multi-key documents",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $lookup: {
              from: "collection",
              localField: "local",
              foreignField: "foreign",
              let: { x: { $literal: { x: 1 } } },
              pipeline: { $sort: { x: 1 } },
              as: "field",
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "let with multi-key document",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $lookup: {
              from: "collection",
              localField: "local",
              foreignField: "foreign",
              let: { x: { $literal: { x: 1, y: 1 } } },
              pipeline: { $sort: { x: 1 } },
              as: "field",
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
  {
    description: "pipeline with multi-key document",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $lookup: {
              from: "collection",
              localField: "local",
              foreignField: "foreign",
              let: { x: { $literal: { x: 1 } } },
              pipeline: { $sort: { x: 1, y: 1 } },
              as: "field",
            },
          },
        ],
      },
    },
    result: Result.VIEW_UNSAFE,
  },
];

describe("$lookup", () => {
  runTestCases(testCases);
});
