/* eslint-disable import/prefer-default-export */

export function validateComment(document, attachments) {
  if (!document) {
    return false;
  }

  if (attachments && attachments.length) {
    return true;
  }

  if (document && document?.text?.trim().length) {
    return true;
  }

  return false;
}

export function validatePost(document, attachments) {
  if (!document) {
    return false;
  }

  const headingBlock = document.nodes.get(0);
  if (headingBlock && !headingBlock.text.trim()) {
    return false;
  }

  for (const node of document.nodes) {
    if (node.type === 'paragraph' && node.text.length > 0) {
      return true;
    }
  }

  if (attachments && attachments.length) {
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

// check document has text
export function hasDocumentText(document) {
  if (!document) {
    return false;
  }

  for (const node of document.content) {
    if (node.type === 'paragraph' && node.content.length > 0) {
      return true;
    }
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
