/* eslint-disable import/prefer-default-export */

export function checkIsEditorEmpty() {
  // TODO: Implement
  return false;
}

export function map(data, callback, ctx) {
  if (Array.isArray(data)) {
    const results = [];

    for (const item of data) {
      const result = callback(item, ctx);

      if (result) {
        if (Array.isArray(result)) {
          results.push(...result);
        } else {
          results.push(result);
        }
      }
    }

    return results;
  }

  return callback(data);
}
