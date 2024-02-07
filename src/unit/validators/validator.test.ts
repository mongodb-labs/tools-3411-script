import { Result } from "../../collections";
import { TestCase, runTestCases } from "../utils";

const testCases: TestCase[] = [
  {
    description: "top-level $jsonSchema",
    collection: {
      options: {
        validator: {
          $jsonSchema: {
            required: ["name", "major", "gpa", "address"],
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              address: {
                bsonType: "object",
                required: ["zipcode"],
                properties: {
                  street: { bsonType: "string" },
                  zipcode: { bsonType: "string" },
                },
              },
            },
          },
        },
      },
    },
    result: Result.SAFE,
  },
  {
    description: "nested $jsonSchema",
    collection: {
      options: {
        validator: {
          $and: [
            {
              $jsonSchema: {
                required: ["name", "major", "gpa", "address"],
                properties: {
                  name: {
                    bsonType: "string",
                    description: "must be a string and is required",
                  },
                  address: {
                    bsonType: "object",
                    required: ["zipcode"],
                    properties: {
                      street: { bsonType: "string" },
                      zipcode: { bsonType: "string" },
                    },
                  },
                },
              },
            },
            { x: [{ x: 1 }] },
          ],
        },
      },
    },
    result: Result.SAFE,
  },
  {
    description: "top-level multi-field match",
    collection: {
      options: {
        validator: { x: 1, y: 1 },
      },
    },
    result: Result.SAFE,
  },
  {
    description: "nested multi-field match",
    collection: {
      options: {
        validator: { x: 1, y: { $eq: { x: 1, y: 1 } } },
      },
    },
    result: Result.VALIDATOR_UNSAFE,
  },
  {
    description: "nested $jsonSchema and multi-field match",
    collection: {
      options: {
        validator: {
          $and: [
            {
              $jsonSchema: {
                required: ["name", "major", "gpa", "address"],
                properties: {
                  name: {
                    bsonType: "string",
                    description: "must be a string and is required",
                  },
                  address: {
                    bsonType: "object",
                    required: ["zipcode"],
                    properties: {
                      street: { bsonType: "string" },
                      zipcode: { bsonType: "string" },
                    },
                  },
                },
              },
            },
            { x: [{ x: 1, y: 1 }] },
          ],
        },
      },
    },
    result: Result.VALIDATOR_UNSAFE,
  },
];

describe("validator", () => {
  runTestCases(testCases);
});
