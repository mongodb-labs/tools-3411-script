export function isValidatorSafe(validator: any): boolean {
  if (validator == null || typeof validator !== "object") {
    return true;
  }
  if (isJSONSchemaOnly(validator)) {
    return true;
  }
  return !Object.values(validator).some(
    hasMultiKeyNonJSONSchemaObjectAtAnyLevel
  );
}

function hasMultiKeyNonJSONSchemaObjectAtAnyLevel(obj: any): boolean {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    return obj.some(hasMultiKeyNonJSONSchemaObjectAtAnyLevel);
  }
  if (isJSONSchemaOnly(obj)) {
    return false;
  }
  const values = Object.values(obj);
  if (values.length > 1) {
    return true;
  }
  return values.some(hasMultiKeyNonJSONSchemaObjectAtAnyLevel);
}

function isJSONSchemaOnly(obj: any): boolean {
  return Object.keys(obj).length === 1 && "$jsonSchema" in obj;
}
