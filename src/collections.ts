export enum Result {
  SAFE,
  VIEW_UNSAFE,
  VALIDATOR_UNSAFE,
}

export function isSafeCollection(collection: any): Result {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return isSafeView(collection);
  }
  if (collection?.options?.validator != null) {
    return isSafeValidator(collection);
  }
  return Result.SAFE;
}

function isSafeView(view: any): Result {
  // TODO implement
  if (Math.random() > 0.9) {
    return Result.VIEW_UNSAFE;
  }
  return Result.SAFE;
}

function isSafeValidator(collection: any): Result {
  // TODO implement
  if (Math.random() > 0.9) {
    return Result.VALIDATOR_UNSAFE;
  }
  return Result.SAFE;
}
