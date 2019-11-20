/* eslint-disable import/prefer-default-export */

export function validateDocument(document, attachments) {
  if (attachments && attachments.length) {
    return true;
  }

  if (document && document.text.length) {
    return true;
  }

  return false;
}

export function validateArticle(document) {
  const headingBlock = document.nodes.get(0);

  if (headingBlock) {
    return Boolean(headingBlock.text.trim());
  }

  return false;
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
