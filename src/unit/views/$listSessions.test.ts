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
            $listSessions: {},
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "allUsers",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $listSessions: { allUsers: true },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
  {
    description: "users",
    collection: {
      type: "view",
      options: {
        pipeline: [
          {
            $listSessions: {
              users: [
                { user: "foo", db: "production" },
                { user: "bar", db: "development" },
                { user: "baz", db: "staging" },
              ],
            },
          },
        ],
      },
    },
    result: Result.SAFE,
  },
];

describe("$listSessions", () => {
  runTestCases(testCases);
});
