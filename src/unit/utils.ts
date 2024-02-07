import { Result, checkCollectionSafety } from "../collections";

export type TestCase = {
  collection: any;
  result: Result;
  description: string;
};

export function runTestCases(testCases: TestCase[]) {
  testCases.forEach(({ collection, result, description }: TestCase) => {
    test(description, () => {
      const actualResult = checkCollectionSafety(collection);
      expect(actualResult).toEqual(result);
    });
  });
}
