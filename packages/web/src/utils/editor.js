/* eslint-disable no-console */
import throttle from 'lodash.throttle';

import { COMMENT_DRAFT_KEY } from 'shared/constants';

export function checkIsEditorEmpty(editorBody, embedsArray) {
  return (
    (!editorBody ||
      !editorBody
        .replace(/<br\/>/g, '')
        .replace(/\s/g, '')
        .replace(/<\/p>/g, '')
        .replace(/<p>/g, '')
        .trim()) &&
    !embedsArray?.length
  );
}

export const saveDraft = throttle((draftObject = {}, key) => {
  let draft;
  try {
    draft = JSON.stringify(draftObject);
  } catch (err) {
    console.warn(`Failed when trying save ${key}!`, err);
  }
  localStorage.setItem(key, draft);
}, 3000);

export function removeDraft(key) {
  localStorage.removeItem(key);
}

export function loadDraft(key, permlink) {
  const draft = localStorage.getItem(key);
  let result;
  try {
    result = draft ? JSON.parse(draft) : null;
  } catch (err) {
    console.warn(`Failed when trying load ${key}!`, err);
  }

  if (key === COMMENT_DRAFT_KEY && result?.permlink !== permlink) {
    return null;
  }
  return result;
}
