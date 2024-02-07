export function isSafeStage(stage: any): boolean {
  if (stage == null || typeof stage !== "object") {
    return true;
  }
  const keys = Object.keys(stage);
  if (keys.length === 0) {
    return true;
  }
  if (keys.length > 1) {
    return false;
  }
  const key = keys[0];
  const inner = stage[key];
  switch (key) {
    // These stages are not affected by reordering of fields.
    case "$changeStream":
    case "$changeStreamSplitLargeEvent":
    case "$collStats":
    case "$count":
    case "$currentOp":
    case "$densify":
    case "$indexStats":
    case "$limit":
    case "$listLocalSessions":
    case "$listSampledQueries":
    case "$listSearchIndexes":
    case "$listSessions":
    case "$out":
    case "$planCacheStats":
    case "$sample":
    case "$shardedDataDistribution":
    case "$skip":
    case "$unset":
    case "$unwind":
      return true;
    // These stages are affected by reordering of nested fields, but not
    // reordering of top-level fields.
    case "$addFields":
    case "$project":
    case "$set":
    case "$match":
    case "$replaceRoot":
    case "$lookup":
    case "$group":
    case "$bucket":
    case "$bucketAuto":
    case "$facet":
    case "$fill":
    case "$geoNear":
    case "$graphLookup":
    case "$setWindowFields":
    case "$unionWith":
    case "$search":
    case "$searchMeta":
      return !hasMultiKeyObjectOutsideTopLevel(inner);
    // These stages are affected by reordering of fields at any level.
    case "$documents":
    case "$redact":
    case "$replaceWith":
    case "$sortByCount":
    case "$sort":
      return !hasMultiKeyObjectAtAnyLevel(inner);
    default:
      return false;
  }
}

function hasMultiKeyObjectOutsideTopLevel(obj: any): boolean {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  return Object.values(obj).some(hasMultiKeyObjectAtAnyLevel);
}

function hasMultiKeyObjectAtAnyLevel(obj: any): boolean {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    return obj.some(hasMultiKeyObjectAtAnyLevel);
  }
  const values = Object.values(obj);
  if (values.length > 1) {
    return true;
  }
  return values.some(hasMultiKeyObjectAtAnyLevel);
}
