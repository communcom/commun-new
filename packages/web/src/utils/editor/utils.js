/* eslint-disable import/prefer-default-export */

// TODO: improve
export function checkIsEditorEmpty(document, attachments) {
  if (attachments && attachments.length) {
    return false;
  }

  if (document && document.text.length) {
    return false;
  }

  return true;
}

export function map(data, callback, ctx) {
  // Проверяется на метод forEach, потому что data может быть массивом или Immutable.Collection
  if (data && data.forEach) {
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
