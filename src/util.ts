import { FailureTracker } from "./tracker";

export function trackMultipleKeyFailures(
  obj: object,
  failureTracker: FailureTracker,
  implication: string
): void {
  if (hasMultipleProperties(obj)) {
    failureTracker.addFailure("object has multiple properties", implication);
  }
}

export function trackObjectFailures(
  obj: object,
  failureTracker: FailureTracker,
  implication: string,
  trackFailures: (
    value: any,
    childTracker: FailureTracker,
    implication: string
  ) => void
): void {
  for (const key in obj) {
    const value = obj[key];
    const childTracker = failureTracker.createChildWithKey(key);
    trackFailures(value, childTracker, implication);
  }
}

export function hasMultipleProperties(obj: object): boolean {
  return hasMoreThanNProperties(obj, 1);
}

export function hasMoreThanNProperties(obj: object, n: number): boolean {
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }
  const keys = Object.keys(obj);
  return keys.length > n;
}

export function isRegExp(query: any): boolean {
  return query?.constructor?.name === "RegExp";
}
