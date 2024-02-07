import { isSafeStage } from "./stage";
import { isValidatorSafe } from "./validator";

export enum Result {
  SAFE,
  VIEW_UNSAFE,
  VALIDATOR_UNSAFE,
}

export function isSafeCollection(collection: any): Result {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return isSafePipeline(collection.options.pipeline);
  }
  if (collection?.options?.validator != null) {
    return isSafeValidator(collection);
  }
  return Result.SAFE;
}

function isSafePipeline(pipeline: any[]): Result {
  if (!pipeline.every(isSafeStage)) {
    return Result.VIEW_UNSAFE;
  }
  return Result.SAFE;
}

function isSafeValidator(validator: any): Result {
  if (isValidatorSafe(validator)) {
    return Result.VALIDATOR_UNSAFE;
  }
  return Result.SAFE;
}
