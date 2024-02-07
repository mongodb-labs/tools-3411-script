import { isStageSafe } from "./stage";
import { isValidatorSafe } from "./validator";

export enum Result {
  SAFE,
  VIEW_UNSAFE,
  VALIDATOR_UNSAFE,
}

export function checkCollectionSafety(collection: any): Result {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return checkPipelineSafety(collection.options.pipeline);
  }
  if (collection?.options?.validator != null) {
    return checkValidatorSafety(collection.options.validator);
  }
  return Result.SAFE;
}

function checkPipelineSafety(pipeline: any[]): Result {
  if (pipeline.every(isStageSafe)) {
    return Result.SAFE;
  }
  return Result.VIEW_UNSAFE;
}

function checkValidatorSafety(validator: any[]): Result {
  if (isValidatorSafe(validator)) {
    return Result.SAFE;
  }
  return Result.VALIDATOR_UNSAFE;
}
