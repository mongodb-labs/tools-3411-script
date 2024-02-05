export function isSafeCollection(collection: any): boolean {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return isSafeView(collection);
  }
  if (collection?.options?.validator != null) {
    return isSafeValidator(collection);
  }
  return true;
}

function isSafeView(view: any): boolean {
  // TODO implement
  if (Math.random() > 0.9) {
    return false;
  }
  return true;
}

function isSafeValidator(collection: any): boolean {
  // TODO implement
  return true;
}
